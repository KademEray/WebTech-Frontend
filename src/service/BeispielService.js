fetch('http://localhost:8080/api/users')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Es gab einen Fehler:', error));


