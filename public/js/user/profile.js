$(document).ready(function(){
    $('.add-btn').on('click', function(){
        $('#add-input').click();
    });

    $('#add-input').on('change', function(){
        var addInput = $('#add-input');

        if(addInput.val() != ''){
            var formData = new FormData();

            formData.append('upload', addInput[0].files[0]);
            $('#completed').html('File Uploaded Successfully');
            $.ajax({
                url: '/userupload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(){
                    addInput.val('');
                }
            })
        }
    });

    $('#profile').on('click',function(){
        var username = $('#username').val();
        var fullname = $('#fullname').val();
        var country = $('#country').val();
        var gender = $('#gender').val();
        var mantra = $('#mantra').val();
        var userImage = $('#add-input').val();

        var valid = true;

        if(username == '' || fullname == '' || country == '' || gender == '' || mnatra == ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger">You can not submit an empty field</div>')
        }else{
            $('#error').html('')
        }

        if(valid === true){
            $.ajax({
                url:'/settings/profile',
                type:'POST',
                data:{
                    username:username,
                    fullname:fullname,
                    gender:gender,
                    country:country,
                    mantra:mantra,
                    upload:userImage
                },
                success:function(){
                    setTimeout(function(){
                        window.location.reload
                    },200)
                }
            })
        }else{
            return false;
        }
    });
});