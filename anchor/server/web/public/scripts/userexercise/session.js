'use strict';

function parseURL(url) {

  var exerciseId = null;
  var patientId = null;
  const urlToArray = url.split('/');
   
  //logged-in user is a clinician
  if (urlToArray.length === 7) {
    exerciseId = urlToArray[5];
    patientId = urlToArray[6];
  }
  
  //logged-in user is a patient
  else if (urlToArray.length === 6) {
    exerciseId = urlToArray.pop();
    patientId = null;
  }

  return {
    patientId: patientId,
    exerciseId: exerciseId
  };
}


function action(nextMode, type) {
  
  const parsedURL = parseURL(window.location.pathname);
  var patientId = parsedURL.patientId;
  var exerciseId = parsedURL.exerciseId;

 window.location = (parsedURL.patientId !== null)? 
 '/userexercise/session/' + nextMode + '/' + type + '/' + exerciseId + '/' + patientId:
 '/userexercise/session/' + nextMode + '/' + type + '/' + exerciseId;                                                  
}

function saveReference() {

  const pathToArray = window.location.pathname.split('/');
  const exerciseId = pathToArray[5];
  const patientId = pathToArray[6];
  const redirectToUrl = '/userexercise/setting/' + exerciseId +'/' + patientId;
  const values = {}; 
  //this is just a dummy data to make sure after saving reference bodyFrames is not empty anymore
  const bodyFrames= [{'trackingId': false}];
  let data = [];
  data.push(bodyFrames);
  values.bodyFrames = JSON.stringify(data);
  
  $.ajax({
    type: 'PUT',
    url: '/api/userexercise/reference/mostrecent/data/' + exerciseId + '/' + patientId,
    data: values,
    success: function (result) {
       window.location = redirectToUrl
    },
    error: function (result) {
      errorAlert(result.responseJSON.message);
    }
  });
   
}

function savePractice() {
  
  const values = {};
  const parsedURL = parseURL(window.location.pathname);
  values.exerciseId = parsedURL.exerciseId;
  let url ='/api/userexercise/practice';
  let patientId = '';

  //logged-in user ia clinician
  if (parsedURL.patientId) {
    url = '/api/userexercise/practice/' + parsedURL.patientId;
    patientId = parsedURL.patientId;
  }
   
  $.ajax({
    type: 'POST',
    url: url,
    data: values,
    success: function (result) {
       window.location = '/userexercise/session/start/practice/' + 
                     parsedURL.exerciseId + '/' + patientId;
    },
    error: function (result) {
      errorAlert(result.responseJSON.message);
    }
  });
}

function goTodashBoard() {
 
  window.location = '/dashboard';
}

function goToExercises() {

  const patientId = window.location .pathname.split('/').pop();
  window.location = '/clinician/patientexercises/' + patientId;
}


 
 

