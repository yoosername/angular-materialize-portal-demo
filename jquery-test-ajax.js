// Test AJAX calls

/*
  Projects Related
*/
// Get all projects
$.ajax({
    url: '/api/projects',
    type: 'GET',
    contentType: 'application/json',
    complete: function(data){console.log(JSON.stringify(data))}
})

// Create new project
$.ajax({
    url: '/api/projects',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({"name":"project1","desc":"this is a new project"}),
    success: function(data){console.log(JSON.stringify(data))},
    error: function(data){console.log(JSON.stringify(data))}
})

// Update a project
$.ajax({
    url: '/api/projects/1',
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({"name":"updatedproject1","desc":"this is an updated project1"}),
    success: function(data){console.log(JSON.stringify(data))},
    error: function(data){console.log(JSON.stringify(data))}
})

// Delete a single project
$.ajax({
    url: '/api/projects/1',
    type: 'DELETE',
    contentType: 'application/json',
    success: function(data){console.log(JSON.stringify(data))},
    error: function(data){console.log(JSON.stringify(data))}
})

/*
  Accounts Related
*/
// Get all accounts
$.ajax({
    url: '/api/accounts',
    type: 'GET',
    contentType: 'application/json',
    complete: function(data){console.log(JSON.stringify(data))}
})

// Create new account
$.ajax({
    url: '/api/accounts',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({"name":"username","desc":"this is a new user"}),
    success: function(data){console.log(JSON.stringify(data))},
    error: function(data){console.log(JSON.stringify(data))}
})

// Update a user
$.ajax({
    url: '/api/accounts/1',
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({"name":"updateduser","desc":"this is an updated user"}),
    success: function(data){console.log(JSON.stringify(data))},
    error: function(data){console.log(JSON.stringify(data))}
})

// Delete a single user
$.ajax({
    url: '/api/accounts/1',
    type: 'DELETE',
    contentType: 'application/json',
    success: function(data){console.log(JSON.stringify(data))},
    error: function(data){console.log(JSON.stringify(data))}
})

/*
  Password Related
*/
// Reset password
$.ajax({
    url: '/api/password',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({"password":"cheeseypees"}),
    success: function(data){console.log(JSON.stringify(data))},
    error: function(data){console.log(JSON.stringify(data))}
})

/*
  Data cleanup
*/
// Delete the test data
$.ajax({
    url: '/api/data/delete',
    type: 'GET',
    contentType: 'application/json',
    success: function(data){console.log(JSON.stringify(data))},
    error: function(data){console.log(JSON.stringify(data))}
})
