
/**
* @name /lib/iinChecker.js
* @description Issuer identification number checker which returns details about a credit/debit card
* @author Simon Wood <simon.wood@holidayextras.com>
*/

( function() {
	
	// get some stuff we need to support IIN Checker
	var _ = require( 'lodash' );
	var request = require( 'request' );
	
	var iinChecker = function( inOptions ) {

		// default options
		this.options = {
			language: 'en'
		}
		
		// if there's any overriding options, blat them over the defaults
		this.options = _.extend( this.options, inOptions );
		
		// Define our constants for comparison
		this.brands = {
			'VISA': 'VISA',
			'MASTERCARD':  'MASTERCARD',
			'AMEX': 'AMERICAN EXPRESS',
			'DISCOVER': 'DISCOVER ',
			'JCB': 'JCB',
			'MAESTRO': 'MAESTRO',
			'LASER': 'LASER',
			
		};
		// DANKORT what do we do with this?
		// CHINA UNION PAY
		// SOLO
		// ELECTRON ??? Don't support? Visa Electron
		
		this.types = {
			'DEBIT': 'DEBIT',
			'CREDIT': 'CREDIT',
			'UNKNOWN': 'UNKNOWN' /* Value incase services are all offline */
		};

		// now fetch the language settings based on the requested language
		this.options.messages = require( './i18n/' + this.options.language ); // ISO 639‑1
	};

	// create a shorthand then export the IinChecker object for Nodejs
	exports = module.exports = iinChecker;
	
	/**
	 * Lookup a card by its IIN and return a card object
	 *
	 * @param  {String} iin
	 * @param  {Function} callback
	 * @return {Object}
	 */
	iinChecker.prototype.lookup = function( iin, callback ) {
		try {
			// convert input to sting incase a int is passed in
			iin = String( iin );

			request( { url: 'http://www.binlist.net/json/' + iin, json: true }, function ( error, response, body ) {
				if (!error && response.statusCode == 200) {
					cardInfo = body;
					
					// remap here


					//cardInfo
					
					if( !_.isObject( cardInfo ) ) {
						throw new TypeError( this.options.messages.PARAMETER_CARDINFO_NOT_OBJECT );
					}
					if( !_.isFunction( callback ) ) {
						throw new TypeError( this.options.messages.PARAMETER_CALLBACK_NOT_FUNCTION );
					}

					// send the results back a-la-node
					callback( null, cardInfo );
					
				}
			} );
		} catch ( err ) {
			// Return the err in the error callback, if not possible return it.
			if ( callback ) {
				callback( err );
			} else {
				return err;
			}
		}
	}
} )();