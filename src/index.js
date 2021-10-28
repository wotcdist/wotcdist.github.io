/**
 * Dependencies
 * @ignore
 */
import Alpine from 'alpinejs'
import './styles.css'
import './flowbite.js'

// Expose module exports to browser window
import * as main from './main.js'
Object.assign(window, main)

// Start Alpine
Alpine.start()