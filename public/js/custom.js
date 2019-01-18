$(function() {
  $('.showrequest').hide();
  $('#searchOffer').click(function() {
    $('.showoffer').show();
    $('.showrequest').hide();
  })

  $('#searchRequest').click(function() {
    $('.showoffer').hide();
    $('.showrequest').show();
  })


  $('#registration_form').submit(function(event) {
    event.preventDefault();
    var fname = $('#registrationform-first_name').val().trim();
    var lname = $('#registrationform-last_name').val().trim();
    var email = $('#registrationform-email').val().trim().toLowerCase();
    var password = $('#registrationform-password').val().trim();
    var cpassword = $('#registrationform-cpassword').val().trim();
    var country = $('#registrationform-country').val().trim();
    var city = $('#registrationform-city').val().trim();
    var phone = $('#registrationform-phone_number').val().trim();

    if (!fname && !lname) {
      swal('Empty!', 'Full Name is required', 'error')
      return;
    }
    if (typeof email !== "undefined") {
      let lastAtPos = email.lastIndexOf('@');
      let lastDotPos = email.lastIndexOf('.');
      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
        swal('Oops!', 'Invalid Email Address', 'error')
        return;
      }
    }
    if (!email) {
      swal('Empty!', 'Email is required', 'error')
      return;
    }
    if (!password) {
      swal('Empty!', 'Password is required', 'error')
      return;
    }
    if (password.length < 6) {
        swal('Oops!', 'Password must be more than 6 characters', 'error')
        return;
      }
      if (password != cpassword) {
        swal('Oops!', 'Password doesn\'t match', 'error')
        return;
      }
      var data = {};
      data.fname = fname;
      data.lname = lname;
      data.email = email;
      data.password = password;
      data.country = country;
      data.city = city;
      data.phone = phone;
      $.ajax({
        method: 'POST',
        url: '/login/signup',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(response) {
          let message = response.message;
          if (response.success) {
            window.location.href = "/profile";
          } else {
            swal('Oops!', message, 'error');
          }
        }
      })
  })

  $('#form_login').submit(function(event) {
    event.preventDefault();
    var email = $('#loginform-email').val().trim().toLowerCase();
    var password = $('#loginform-password').val().trim();

    if (typeof email !== "undefined") {
      let lastAtPos = email.lastIndexOf('@');
      let lastDotPos = email.lastIndexOf('.');
      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
        swal('Oops!','*Email is not valid', 'error');
        return;
      }
    }
    if (!email) {
      swal('Empty!','Email is required', 'error');
      return;
    }
    if (!password) {
      swal('Empty!','Password is required', 'error');
      return;
    }
    var data = {};
    data.email = email;
    data.password = password
    $.ajax({
      method: 'POST',
      url: '/login',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(response) {
        let message = response.message;
        if (response.success) {
          setTimeout(function() {
            window.location.href = '/profile';
          }, 500)
        } else {
          swal('Oops!', message, 'error');
        }
      }
    })
  })

  $('#recovery_pass_form').submit(function(event) {
    event.preventDefault();
    var email = $('#passwordresetrequestform-email').val().trim().toLowerCase();
    if (typeof email !== "undefined") {
      let lastAtPos = email.lastIndexOf('@');
      let lastDotPos = email.lastIndexOf('.');
      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
        swal('Oops!','*Email is not valid', 'error');
        return;
      }
    }
    if (!email) {
      swal('Empty!','Email is required', 'error');
      return;
    }
    var data = {};
    data.email = email;
    $.ajax({
      method: 'POST',
      url: '/login/verify-user',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(response) {
        let message = response.message;
        if (response.success) {
          $('#passwordresetrequestform-email').val('');
          $('#success-reset-password').html(message);
        } else {
          swal('Oops!', message, 'error');
        }
      }
    })
  })
  //from forget password
  $('#change_password').submit(function(event) {
    event.preventDefault();
    var newpassword = $('#reset-newpassword').val().trim();
    var confirmnewpassword = $('#reset-cpassword').val().trim();
    var userToken = $('#userToken').val();
    if (!newpassword) {
      swal('Empty','New Password is required', 'error');
      return;
    }
    if (newpassword.length < 6) {
      swal('Oops!','Password must be more than 6 characters','error');
      return;
    }
    if (newpassword != confirmnewpassword) {
      swal('Oops','Password doesn\'t match','error');
      return;
    }
    var data = {};
    data.newpassword = newpassword;
    $.ajax({
         method: 'POST',
         url: '/login/reset-password/'+userToken,
         data: JSON.stringify(data),
         contentType: 'application/json',
         success: function(response) {
           let message = response.message;
           if (response.success) {
             window.location.href = "/login";
           } else {
             swal('Oops!', message, 'error');
           }
         }
    })
  })

  //from profile
  $('#editPassword').submit(function(event) {
    event.preventDefault();
    var currentPassword = $('#currentPassword').val().trim();
    var newpassword = $('#newpassword').val().trim();
    var confirmnewpassword = $('#confirmpassword').val().trim();
    if (!currentPassword) {
      swal('Empty','Current Password is required', 'error');
      return;
    }
    if (!newpassword) {
      swal('Empty','New Password is required', 'error');
      return;
    }
    if (newpassword.length < 6) {
      swal('Oops!','Password must be more than 6 characters','error');
      return;
    }
    if (newpassword != confirmnewpassword) {
      swal('Oops','Password doesn\'t match','error');
      return;
    }
    var data = {};
    data.currentPassword = currentPassword;
    data.newpassword = newpassword;
    $.ajax({
         method: 'POST',
         url: '/profile/edit-password',
         data: JSON.stringify(data),
         contentType: 'application/json',
         success: function(response) {
           let message = response.message;
           if (response.success) {
             swal('Success!', message, 'success');
             $('#currentPassword').val('');
             $('#newpassword').val('');
             $('#confirmpassword').val('');
           } else {
             swal('Oops!', message, 'error');
           }
         }
    })
  })

  $('#fileinput').change( function(e) {
    $('#changeImage').submit();
   });

})
