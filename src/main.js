
/**
 * Dependencies
 * @ignore
 */
import { create as ipfs } from 'ipfs-http-client'
import compareVersions from 'compare-versions'
import DOMPurify from 'dompurify'

/**
 * Constants
 * @ignore
 */
const url = 'https://ipfs.io'
const retryBackoff = [1000, 5000, 10000, 30000]
const retryThreshold = 4
const addr = '/ipns/k51qzi5uqu5dl9338fpk7jrfx20ayprickx11r7fpyyna5v2982yk404c6q0mo'
let client

/**
 * Scripts
 * @ignore
 */
function getClient() {
  if (!client) {
    client = ipfs({ url, timeout: 5000 })
  }
  return client
}

async function resolveName(name) {
  const client = getClient();
  const hashes = []

  const controller = new AbortController()
  const { signal } = controller

  try {
    for await (const hash of client.name.resolve(name, { signal })) {
      hashes.push(hash)
    }

  } finally {
    controller.abort()
  } 

  return hashes
}

async function listFolder(path) {
  const client = getClient();
  const files = []

  const controller = new AbortController()
  const { signal } = controller

  try {  
    for await (const file of client.ls(path, { signal })) {
      file.hash = file.cid.toString()
      files.push(file)
    }

  } finally {
    controller.abort()
  }

  return files
}

async function getVersion(versionRoot) {
  const { name: version, path } = versionRoot
  const files = await listFolder(path)
  const manifestFile = files.find(item => item.name === 'world.json')
  const manifest = await fetch(`${url}/ipfs/${manifestFile.cid.toString()}`).then(res => res.json())
  const coverFile = files.find(item => item.name.startsWith('cover'))
  const cover = getGatewayUrl(coverFile.cid.toString(), coverFile.name)

  return { version, files, cover, manifest }
}

function sortVersion(a, b) {
  const { version: na } = a
  const { version: nb } = b

  const [, va] = na.split('-')
  const [, vb] = nb.split('-')

  return compareVersions(va, vb)
}

async function getWorld(worldRoot) {
  const { name, path } = worldRoot
  const worldVersions = await listFolder(path)

  const versions = await Promise.all(
    worldVersions
      .filter(item => item.type === 'dir')
      .map(version => getVersion(version))
  )
  
  return { name, versions: versions.sort(sortVersion).reverse() }
}

async function getData(retry = 0) {
  try {
    const [hash] = await resolveName(addr)
    const root = await listFolder(hash)
    console.log('ROOT', root)

    const worlds = await Promise.all(
      root
        .filter(item => item.type === 'dir')
        .map(root => getWorld(root))
    )

    console.log('WORLDS', worlds)
    return worlds

  } catch (err) {
    if (retry < retryThreshold) {
      return new Promise(resolve => setTimeout(() => resolve(getData(retry+1)), retryBackoff[retry]))
    }

    throw err
  }
}

async function getManifest(retry = 0) {
  try {
    const [hash] = await resolveName(addr)
    const manifest = await fetch(`${url}/${hash}/index.json`).then(res => res.json())
    console.log('MANIFEST', manifest)
    return manifest

  } catch (err) {
    if (retry < retryThreshold) {
      return new Promise(resolve => setTimeout(() => resolve(getManifest(retry+1)), retryBackoff[retry]))
    }

    throw err
  }
}

function badgeText(left, right) {
  return `${left} | ${right}`
}

function getGatewayUrl(hash, filename) {
  const path = `${url}/ipfs/${hash}`

  return filename
    ? `${path}?filename=${filename}`
    : path
}

/**
 * Exports
 * @ignore
 */
export {
  getData,
  getManifest,
  getGatewayUrl,
  badgeText,
  DOMPurify,
}