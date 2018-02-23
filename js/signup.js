if (typeof allBirds === "undefined" || !allBirds) {
	var allBirds = {};
}

allBirds.ecom = allBirds.ecom || {};

// Global vars
var $regForm = $('#registerForm'),
	$regFirstName = $('#registerFirstName'),
	$regLastName = $('#registerLastName'),
	$regEmail = $('#registerEmail'),
	$emailList = $('#emailList'),
	$regPassword = $('#registerPassword'),
	$regConfirmPassword = $('#registerConfirmPassword');
	$loginEmail = $('#loginEmail'),
	$loginPassword = $('#loginPassword');

allBirds.ecom.authentication = {

    // storing input from register-form
    store: function() {

		var	registerFirstName = $regFirstName.val(),
			registerLastName = $regLastName.val(),
			registerEmail = $regEmail.val(),
			registerPassword = $regPassword.val(),
			registerConfirmPassword = $regConfirmPassword.val(),
			emailList = $emailList.is(':checked');

		localStorage.setItem('registerFirstName', registerFirstName);
		localStorage.setItem('registerLastName', registerLastName);
		localStorage.setItem('registerEmail', registerEmail);
		localStorage.setItem('registerPassword', registerPassword);
		localStorage.setItem('registerConfirmPassword', registerConfirmPassword);
		localStorage.setItem('emailList', emailList);

    },

    // check if stored data from register-form is equal to entered data in the login-form
    check: function() {

        // stored email from the register-form
        var storedEmail = localStorage.getItem('registerEmail');

		// if stored email equals email entered
		if ( storedEmail == $regEmail.val() ) {
			$('.post-container-sign-up, .post-container-sign-up .exists').show();
			$('#registerForm').hide();
		// Otherwise save it
		} else {
			allBirds.ecom.authentication.store();
			$('.post-container-sign-up, .post-container-sign-up .success').show();
			$('#registerForm').hide();
		}

    },

    validate: {
		fields: function( $elem, re ) {
			var errorMsg = $elem.data('error-msg');
		    // test input against rule
			// if input passes regex pattern
		    if ( re.test( $elem.val() ) ) {
				// if password passes input test, set is as pattern for confirm password
				if ($elem.attr('id') == 'registerPassword') {
					$regConfirmPassword.attr('pattern', $elem.val());
				}
				// remove error indicators
				$elem.removeClass('error').addClass('valid');
				$elem.next().remove(".error-message");
		    } else {
				// show error indicators
				$elem.removeClass('valid').addClass('error');
				if ( !$elem.nextAll('.error-message').length ) {
					$elem.after('<p class="error-message">' + errorMsg + '</p>');
				}
		    }
		},
		// run vaildator against fields onblur
		loseFocus: function() {
			$regForm.find('.form-control').each( function( idx ) {
				var $this = $(this),
					storedEmail = localStorage.getItem('registerEmail');
				$this.on( 'blur', function() {
					var pattern = new RegExp($this.attr('pattern'));
					allBirds.ecom.authentication.validate.fields( $this, pattern );
					// test if email is already stored and alert if so
					if ( $this.val() == storedEmail ) {
						$this.after('<p class="error-message">This email is already in use. Please login.</p>');
					}
				})
			})
		},
		// run validator onsubmit
		form: function() {
			$regForm.find('.form-control').each( function( idx ) {
				var $this = $(this),
			 		pattern= new RegExp($this.attr('pattern'));
				allBirds.ecom.authentication.validate.fields( $this, pattern );
			})
		}
    },

	login: function() {

		var storedEmail = localStorage.getItem('registerEmail'),
        	storedPassword = localStorage.getItem('registerPassword');
		// if login success, log in
		if ( storedEmail == $loginEmail.val() && storedPassword == $loginPassword.val() ) {
			$('.post-container-sign-in, .post-container-sign-in .logged-in').show();
			$('#loginForm').hide();
		// otherwise show error
		} else {
			$('.post-container-sign-in, .post-container-sign-in .login-error').show();
			$('#loginForm').hide();
		}

	},

	// after reg, clear form
	clearForm: function() {
		$regForm.find("input[type=text], input[type=password], input[type=email]").val("");
	},

	buttons: {

		continueToSite: function() {
			$('#continueToSite').on('click', function() {
				window.location.reload(true);
			})
		},

		returnToRegistration: function() {
			$('#return').on('click', function() {
				$('.post-container-sign-up, .post-container-sign-up .exists').hide();
				$('#registerForm').show();

			})
		},

		returnToLogin: function() {
			$('.login-error').on('click', function() {
				window.location.reload(true);
			})
		},

		login: function() {
			$('#loginBtn').on( 'click', function(e) {
				e.preventDefault(); // prevent the form from attempting to send to the web server
				allBirds.ecom.authentication.login();
			})
		},

		next: function() {
			$('#nextBtn').on( 'click', function(e) {
				e.preventDefault(); // prevent the form from attempting to send to the web server
				$('.name-password-reg').hide('fast');
				$('.address-group').show('fast');
			})
		},
		previous: function() {
			$('#prevBtn').on( 'click', function(e) {
				e.preventDefault(); // prevent the form from attempting to send to the web server
				$('.name-password-reg').show('fast');
				$('.address-group').hide('fast');
			})
		},

		// utility
		clearLocalStorage: function() {
			var $clear = $('#clear');
			if (localStorage.length == 0) $clear.attr('disabled', true);
			$clear.on('click', function() {
				localStorage.clear();
				$clear.attr('disabled', true);
				window.location.reload(true);
			})
		}

	},

	// slide when shifting between login and signup
	slide: function() {
		$('.toggle-btn').on('click', function() {
			$('.container').toggleClass('s--signup')
		})
	},

	// display toggle links when on mobile
	mobile: {
		linkToReg: function() {
			$('.link-sign-up a').on('click', function(e) {
				e.preventDefault();
				$('.container').toggleClass('s--signup')
			})
		},
		linkToLogin: function() {
			$('.link-sign-in a').on('click', function(e) {
				e.preventDefault();
				$('.container').toggleClass('s--signup')
			})
		}
	},

    init: function() {
		allBirds.ecom.authentication.slide();
		allBirds.ecom.authentication.mobile.linkToReg();
		allBirds.ecom.authentication.mobile.linkToLogin();
		allBirds.ecom.authentication.validate.loseFocus();
		allBirds.ecom.authentication.buttons.clearLocalStorage();
		allBirds.ecom.authentication.buttons.login();
		allBirds.ecom.authentication.buttons.returnToRegistration();
		allBirds.ecom.authentication.buttons.returnToLogin();
		allBirds.ecom.authentication.buttons.continueToSite();
		allBirds.ecom.authentication.buttons.next();
		allBirds.ecom.authentication.buttons.previous();

		$('#registerBtn').on( 'click', function(e) {
			e.preventDefault(); // prevent the form from sending a get
			allBirds.ecom.authentication.validate.form();
			// if any invalid fields, prevent form submissions
			if ( $regForm.find('.form-control').hasClass('error') ) return false
			allBirds.ecom.authentication.check();
			allBirds.ecom.authentication.clearForm();
			// enable clearing local storage button after user registers
			$('#clear').attr('disabled', false);
		})

    }

}

$(document).ready(function () {

	allBirds.ecom.authentication.init();

});
