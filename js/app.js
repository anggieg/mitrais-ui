// main function
const API_PORT=3099;
jQuery(function(){

    // initialFormState
    enableForm(true);

    // load value for date, month and year in date of birth input
    loadDobDate();
    loadDobMonth();
    loadDobYear();

    // when registration form is submitted
    $('#registrationForm').on('submit', function(e){
        // prevent form default behaviour
        e.preventDefault();

        // populate form data
        const formData = $(this).serializeArray();
        const parsedData = {};

        // map form data to javascript object
        formData.map(d => {
            return parsedData[d.name] = d.value ;
        });

        // form error checking
        const formError = []; // initialize form error in an array

        // map an already declared "requiredFields" variable then compare each of it's elements with each data from
        // the registration form to check if every required field is not empty
        requiredFields.map(r => {
            if(parsedData[r.name] === ''){
                formError.push(r.label);
            }
        });

        // if formError array has at least one element
        if(formError.length > 0){
            return showFormError( `Please fill in the following : ${formError.join(', ')}`);
        }

        // disable form before executing ajax request
        enableForm(false);

        // ajax request to backend
        $.ajax({
            url: `http://localhost:${API_PORT}/api/auth/register`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(parsedData),
            dataType: 'json',
            success: function(response){

                // if request response returns a error status then show error message, re-enable form input and stop code execution
                if(response.status === 'error'){
                    showFormError(response.message);
                    enableForm(true);
                    return;
                }

                // if request response returns a success
                //clear form error (if any)
                clearFormError();
                // clear every form value
                clearFormInput();
                // show success alert
                showAlertWithTimer({icon: 'success', text: response.message});
                // show login button
                showLoginButton(true);
            },
            error: function(error){
                // if error occurred then show error message and enable form input
                console.log(error);
                // showFormError(JSON.parse(error.responseText)['message']);
                enableForm(true);
            }
        })
    });

    // login button in login page is clicked, show success alert
    $('#loginButton').on('click', function(){
        showAlertWithTimer({icon: 'success', text: 'Login Success'});
    });

    // input handler for mobile number. prevent non numeric character to be inserted
    $('#mobileNumber').on('keypress', function(e){
        const charCode = e.which ? e.which : e.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57)){
            return false;
        }
        return true;
    });
});


// method to show form errors on top of the registration form
function showFormError(error){
    $('#formError').html(`
        <div class="alert alert-danger text-center">
        Error! ${error}
        </div>
    `);
}

// method to clear form errors on top of the registration form if any
function clearFormError(){
    $('#formError').html('');
}


// required input fields in the registration form
const requiredFields = [
    {name: 'mobileNumber', label: 'Mobile Number'},
    {name: 'firstName', label: 'First Name'},
    {name: 'lastName', label: 'Last Name'},
    {name: 'email', label: 'Email'}
];

// method to enable / disable form
function enableForm(isEnabled){
    isEnabled 
    ? $("#registrationForm :input").prop("disabled", false) 
    : $("#registrationForm :input").prop("disabled", true);
}

// method to clear form input
function clearFormInput(){
    $('#registrationForm').trigger('reset');
}

// method to show / hide login button
function showLoginButton(isShown){
    isShown
    ? $('#loginButtonContainer').removeClass('d-none')
    : $('#loginButtonContainer').addClass('d-none') ;
}

// method to show popup alert
function showAlertWithTimer(data){
    Swal.fire({
        icon: data.icon,
        text: data.text,
        timer: 1000,
        showConfirmButton: false,
        position: 'center',
        heightAuto: false
    });
}

// method to load list of date for the date selection input 
function loadDobDate(){
    const min = 1;
    const max = 31;
    let dobDate = '<option value="">-- Date --</option>';
    for(i = min ; i <= max ; i++){
        i = i.toString().length == 1 ? '0'+i : i;
        dobDate += `<option value="${i}">${i}</option>`
    }
    $('#dobDate').append(dobDate);
}

// method to load list of month for month selection input
function loadDobMonth(){
    const months = [
        {name: 'Jan', value: '01' },
        {name: 'Feb', value: '02' },
        {name: 'Mar', value: '03' },
        {name: 'Apr', value: '04' },
        {name: 'May', value: '05' },
        {name: 'Jun', value: '06' },
        {name: 'Jul', value: '07' },
        {name: 'Aug', value: '08' },
        {name: 'Sep', value: '09' },
        {name: 'Oct', value: '10' },
        {name: 'Nov', value: '11' },
        {name: 'Dec', value: '12' },
    ];

    let dobMonth = '<option value="">-- Month --</option>';
    months.map(m => {
        dobMonth += `<option value="${m.value}">${m.name}</option>`
    });

    $('#dobMonth').append(dobMonth);
}

// method to load list of year for year selection input
function loadDobYear(){
    const min = 1970;
    const max = new Date().getFullYear();
    let dobYear = '<option value="">-- Year --</option>';
    for(i = min ; i <= max ; i++){
        dobYear += `<option value="${i}">${i}</option>`
    }
    $('#dobYear').append(dobYear);
}


