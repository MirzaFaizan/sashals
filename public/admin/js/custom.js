$(function() {
  //Add New Category
  $('#categoryForm').submit(function(event) {
    event.preventDefault();
    var categoryName = $('#categoryName').val().trim();

    if (!categoryName) {
      swal('Oops!', "Category name is required", "error");
      return;
    }
    var data = {};
    data.categoryName = categoryName;
    $.ajax({
      method: 'POST',
      url: '/admin/category/add',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(response) {
        let message = response.message;
        if (response.success) {
          swal('Success!', message, 'success');
          $('#categoryName').val('');
        } else {
          swal('Oops!', message, 'error');
        }
      }
    });
  });

  //Add New Admin
  $('#adminForm').submit(function(event) {
      event.preventDefault();
      var username = $('#username').val().trim();
      var email = $('#email').val().trim().toLowerCase();
      var password = $('#password').val().trim();
      var cpassword = $('#cpassword').val().trim();

      $('#errName').html('');
      $('#errEmail').html('');
      $('#errPassword').html('');
      $('#errConfirmPass').html('');

      if (!username) {
        swal('Oops!', "Name is required", "error");
        return;
      }
      if (typeof email !== "undefined") {
        let lastAtPos = email.lastIndexOf('@');
        let lastDotPos = email.lastIndexOf('.');
        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
          swal('Oops!', "Email is not valid", "error");
          return;
        }
      }
      if (!email) {
        swal('Oops!', "Email is required", "error");
        return;
      }
      if (!password) {
        swal('Oops!', "Password is required", "error");
        return;
      }
      if (password.length < 6) {
        swal('Oops!', "Password must be more than 6 characters", "error");
        return;
      }
      if (password != cpassword) {
        swal('Oops!', "Password doesn\'t match", "error");
        return;
      }
      var data = {};
      data.username = username;
      data.email = email;
      data.password = password;
      $.ajax({
        method: 'POST',
        url: '/admin/new/add',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(response) {
          let message = response.message;
          if (response.success) {
            swal('Success!', message, 'success');
            $('#username').val('');
            $('#email').val('');
          } else {
            swal('Oops!', message, 'error');
          }
          $('#password').val('');
          $('#cpassword').val('');
        }
      })
    })

    //Change General admin
    $('#adminChangeSetting').submit(function(event) {
      event.preventDefault();
      var username = $('#editusername').val().trim();
      var email = $('#editemail').val().trim().toLowerCase();
      var question = $('#editquestion').val();
      var answer = $('#editanswer').val().trim();

      if (!username) {
        swal('Oops!', 'Name is required', 'error');
        return;
      }
      if (typeof email !== "undefined") {
        let lastAtPos = email.lastIndexOf('@');
        let lastDotPos = email.lastIndexOf('.');
        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
          swal('Oops!', 'Invalid Email', 'error');
          return;
        }
      }
      if (!email) {
        swal('Oops!', 'Email is required', 'error');
        return;
      }
      if (!answer) {
        swal('Oops!', 'Answer is required', 'error');
        return;
      }

      var data = {};
      data.username = username;
      data.email = email;
      data.question = question;
      data.answer = answer;
      $.ajax({
        method: 'POST',
        url: '/admin/setting/general',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(response) {
          let message = response.message;
          if (response.success) {
            swal('Success!', message, 'success');
          } else {
            swal('Oops!', message, 'error');
          }
        }
      })
    })

    //Change password
    $('#adminChangePassword').submit(function(event) {
      event.preventDefault();
      var currentpassword = $('#currentpassword').val().trim();
      var newpassword = $('#newpassword').val().trim();
      var confirmnewpassword = $('#confirmnewpassword').val().trim();

      if (!currentpassword) {
        swal('Oops!', 'Password is required', 'error');
        return;
      }
      if (!newpassword) {
        swal('Oops!', 'New Password is required', 'error');
        return;
      }
      if (newpassword.length < 6) {
        swal('Oops!', 'Password must be more than 6 characters', 'error');
        return;
      }

      if (newpassword != confirmnewpassword) {
        swal('Oops!', 'Password doesn\'t match', 'error');
        return;
      }

      var data = {};
      data.currentpassword = currentpassword;
      data.newpassword = newpassword;
      $.ajax({
        method: 'POST',
        url: '/admin/setting/change-password',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(response) {
          let message = response.message;
          if (response.success) {
            swal('Success!', message, 'success');
          } else {
            swal('Oops!', message, 'error');
          }
          $('#currentpassword').val('');
          $('#newpassword').val('');
          $('#confirmnewpassword').val('');
        }
      })
    })

    //Displaying Password
    $('#btnChangePassword').click(function() {
      $('#changePass').show();
    })
})
