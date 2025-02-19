function login() {
    /**/

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(function () {
            // Existing and future Auth states are now persisted in the current
            // session only. Closing the window would clear any existing state even
            // if a user forgets to sign out.
            // ...
            // New sign-in will be persisted with session persistence.

            /*
                this is to RESUCE Simultaneous connections to database
                user may forget to signout and for weeks he/she remains signed in
                thats bad.
            */

            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function (result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                window.location = "dashboard.html";
                return "login done";

            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
                window.alert(errorMessage);
            });
            /**/

        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert(errorMessage);
        });
}

function logout() {

    if (document.getElementById('template-name') != null)
        if (document.getElementById('template-name').innerText != 'resume_elon_musk')
            saveResume();
    firebase.auth().signOut()
        .then(function () {
            window.location = "index.html";
        });
    return "logout successful";
}

function selectAll(e) {
    if(e.innerText == "Click to select")
        document.execCommand('selectAll', true, "replace this");
    //firefox doesn't allow keyboard operations with scripts
}

function applyBorder(element) {
    element.style.border = "1px solid rgb(150,150,150)";
    element.style.borderRadius = "3px";
}

function checkFields() {
    var fields = document.getElementsByClassName('input-field');
    var i;
    for (i = 0; i < fields.length; i++) {
        if (fields[i].innerText == "")
            return false;
    }
    return true;
}

function ValidateEmail(emailid) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailid)) {
        return (true);
    }
    return (false);
}

function printResume() {
    //document represent respective resume template
    if (!checkFields()) {
        window.alert('you can not have Empty fields printed');
        return;
    }
    var emailfield = document.getElementById('e-mail').innerText.trim();
    if (!ValidateEmail(emailfield)) {
        window.alert('Invalid Email!');
        return;
    }
    document.getElementsByTagName('title')[0].innerHTML = emailfield.substring(0, emailfield.indexOf("@")) + "_Resume";

    var printdocument = document.getElementById('resume').innerHTML;
    var originalDocument = document.body.innerHTML;

    //order matter here
    document.getElementById('resume').classList.remove('my-resume-page');
    document.body.style.background = "white";
    document.body.innerHTML = printdocument;
    var addbtns = document.getElementsByClassName('addButton');
    var rmbtns = document.getElementsByClassName('removeButton');
    var inputs = document.getElementsByTagName('input');

    var i;
    for (i = 0; i < addbtns.length; i++)
        addbtns[i].style.display = 'none';
    for (i = 0; i < rmbtns.length; i++)
        rmbtns[i].style.display = 'none';

    for (i = 0; i < inputs.length; i++) {
        inputs[i].style.display = 'none';
    }
    if (document.getElementById('photocaption') != null) {
        document.getElementById('photocaption').style.display = 'none';
    }
    //
    //$(document).ready();
    //img isn't ready and its printing already
    //so set timeout and wait for image to load
    //.5s would be sufficient
    setTimeout(function () {
        window.print();
        document.body.innerHTML = originalDocument;
    }, 500);
    return "print successful";
}

function previewResume() {

    var pagemessage = document.getElementById('page-approx-message');
    var addbtns = document.getElementsByClassName("addButton");
    var rmbtns = document.getElementsByClassName("removeButton");
    var inputs = document.getElementsByTagName('input');
    var i;
    if (isPreviewClicked) {
        for (i = 0; i < addbtns.length; i++) {
            addbtns[i].style.display = 'none';
        }
        for (i = 0; i < rmbtns.length; i++) {
            rmbtns[i].style.display = 'none';
        }
        for (i = 0; i < inputs.length; i++) {
            inputs[i].style.display = 'none';
        }
        if (document.getElementById('photocaption') != null) {
            document.getElementById('photocaption').style.display = 'none';
        }

        pagemessage.classList.remove('invisible');

        document.getElementById("preview-doc").innerHTML = "Edit";
        isPreviewClicked = false; //now edit option should be available
    } else {
        for (i = 0; i < addbtns.length; i++) {
            addbtns[i].style.display = 'inline';
        }
        for (i = 0; i < rmbtns.length; i++) {
            rmbtns[i].style.display = 'inline';
        }
        for (i = 0; i < inputs.length; i++) {
            inputs[i].style.display = 'inline-block';
        }

        if (document.getElementById('photocaption') != null) {
            document.getElementById('photocaption').style.display = 'inline-block';
        }
        pagemessage.classList.add('invisible');
        document.getElementById("preview-doc").innerHTML = "Preview";
        isPreviewClicked = true; //now Preview option should be available
    }

    return "preview successful";
}

function loadResume(callback, template = -1, ref = null) {

    if (template == -1)
        template = document.getElementById('template-name').innerHTML;
    //retrieve data    

    if (ref == null)
        ref = firebase.database().ref("users/" + user.uid + "/" + template);

    ref.on("value", function (snapshot) {
        //console.log(snapshot.val());
        var tablerows;
        var i, j;

        //Heading
        if (snapshot.child('name').val())
            document.getElementById('stud-name')
                .innerHTML = "" + snapshot.child('name').val();
        if (snapshot.child('email').val() != null)
            document.getElementById('e-mail')
                .innerHTML = "" + snapshot.child('email').val();
        if (snapshot.child('dob').val() != null)
            document.getElementById('dob')
                .innerHTML = "" + snapshot.child('dob').val();
        if (snapshot.child('address').val() != null)
            document.getElementById('address')
                .innerHTML = "" + snapshot.child('address').val();

        //Education
        tablerows = document.getElementById('education-table').tBodies[0].rows;
        var edu_tabledata = snapshot.child('education').val();
        var rowstobeupdated = edu_tabledata.length;
        while (rowstobeupdated - (tablerows.length) > 0) {
            addEducation();
            tablerows = document.getElementById('education-table').tBodies[0].rows;
        } //addextra rows bcoz database has more rows then html table
        while ((tablerows.length) - rowstobeupdated > 0) {
            removeRow('education-table');
            tablerows = document.getElementById('education-table').tBodies[0].rows;
        } //remove rows bcoz default html has more rows then database
        for (i = 0; i < rowstobeupdated; i++) { //update rows
            for (j = 0; j < 4; j++)
                tablerows[i].cells[j].innerHTML = edu_tabledata[i][j];
            //console.log(i);
        }

        //skills
        tablerows = document.getElementById('skills-table').tBodies[0].rows;
        var skills_tabledata = snapshot.child('skills').val();
        rowstobeupdated = skills_tabledata.length;
        while (rowstobeupdated - (tablerows.length) > 0) {
            addSkills();
            tablerows = document.getElementById('skills-table').tBodies[0].rows;
        } //when database has more rows
        while ((tablerows.length) - rowstobeupdated > 0) {
            removeRow('skills-table');
            tablerows = document.getElementById('skills-table').tBodies[0].rows;
        } //when defalt html page got more rows
        for (i = 0; i < rowstobeupdated; i++) {
            tablerows[i].cells[1].innerHTML = skills_tabledata[i];
        }

        //Internships
        tablerows = document.getElementById('internships-table').tBodies[0].rows;
        var internships_tabledata = snapshot.child('internships').val();
        rowstobeupdated = internships_tabledata.length;
        while (rowstobeupdated - (tablerows.length) > 0) {
            addInternships();
            tablerows = document.getElementById('internships-table').tBodies[0].rows;
        }
        while ((tablerows.length) - rowstobeupdated > 0) {
            removeRow('internships-table');
            tablerows = document.getElementById('internships-table').tBodies[0].rows;
        }
        for (i = 0; i < rowstobeupdated; i++) {
            for (j = 0; j < 3; j++) {
                tablerows[i].cells[j].innerHTML = internships_tabledata[i][j];
            }
        }

        //Projects
        tablerows = document.getElementById('projects-table').tBodies[0].rows;
        var projects_tabledata = snapshot.child('projects').val();
        rowstobeupdated = projects_tabledata.length;
        while (rowstobeupdated - (tablerows.length) > 0) {
            addProjects();
            tablerows = document.getElementById('projects-table').tBodies[0].rows;
        }
        while ((tablerows.length) - rowstobeupdated > 0) {
            removeRow('projects-table');
            tablerows = document.getElementById('internships-table').tBodies[0].rows;
        }
        for (i = 0; i < rowstobeupdated; i++) {
            for (j = 0; j < 3; j++) {
                tablerows[i].cells[j].innerHTML = projects_tabledata[i][j];
            }
        }

        //positions
        if (snapshot.child('positions').val() != null)
            document.getElementById('positions-list')
                .innerHTML = snapshot.child('positions').val();
        //hobbies
        if (snapshot.child('hobbies').val() != null)
            document.getElementById('hobbies-list')
                .innerHTML = snapshot.child('hobbies').val();
        //positions
        if (snapshot.child('awards').val() != null)
            document.getElementById('awards-list')
                .innerHTML = snapshot.child('awards').val();

        callback();
        
        return "user data loaded from latest saved database";
    }, function (error) {
        console.log("Error: " + error.code);
    });

}

function saveResume() {
    //Heading
    var template = document.getElementById('template-name').innerHTML;
    var studentname = document.getElementById('stud-name').innerHTML;
    var emailaddr = document.getElementById('e-mail').innerHTML;
    var dob = document.getElementById('dob').innerHTML;
    var address = document.getElementById('address').innerHTML;
    var tablerows;
    var i, j;
    //Education
    tablerows = document.getElementById('education-table').tBodies[0].rows;
    //console.log(tablerows.length);
    var edu_tabledata = [];
    for (i = 0; i < tablerows.length; i++) {
        edu_tabledata[i] = [];
        var rowcells = tablerows[i].cells;
        for (j = 0; j < 4; j++)
            edu_tabledata[i][j] = rowcells[j].innerHTML;
        //console.log(i);
    }
    //console.log(edu_tabledata);
    //Skills
    tablerows = document.getElementById('skills-table').tBodies[0].rows;
    var skills_tabledata = [];
    for (i = 0; i < tablerows.length; i++) {
        skills_tabledata.push(tablerows[i].cells[1].innerHTML);
    }
    //console.log(skills_tabledata);
    //Internships
    tablerows = document.getElementById('internships-table').tBodies[0].rows;
    var internships_tabledata = [];
    for (i = 0; i < tablerows.length; i++) {
        internships_tabledata[i] = [];
        for (j = 0; j < 3; j++) {
            internships_tabledata[i][j] = tablerows[i].cells[j].innerHTML;
        }
        //console.log(i);
    }
    //Projects
    tablerows = document.getElementById('projects-table').tBodies[0].rows;
    var projects_tabledata = [];
    for (i = 0; i < tablerows.length; i++) {
        projects_tabledata[i] = [];
        for (j = 0; j < 3; j++) {
            projects_tabledata[i][j] = tablerows[i].cells[j].innerHTML;
        }
    }
    //positions
    var ul = document.getElementById('positions-list')
    var positions_list = ul.innerHTML;
    //hobbies
    ul = document.getElementById('hobbies-list');
    var hobbies_list = ul.innerHTML;
    //achievments
    var awards_list = document.getElementById('awards-list').innerHTML;



    //make resume dictionary map
    var resumeDetails = {
        name: studentname,
        email: emailaddr,
        dob: dob,
        address: address,
        education: edu_tabledata,
        skills: skills_tabledata,
        internships: internships_tabledata,
        projects: projects_tabledata,
        positions: positions_list,
        hobbies: hobbies_list,
        awards: awards_list
    };

    //add uid into user_uid_list
    //for flattening the tree so that for finding user
    //we do not have to load all users data.
    //firebase.database().ref("user_uid_list").push(user.uid);
    //firebase.database().ref().child("text").push("somevalue");

    //add resume to dictionary
    firebase.database().ref("users/" + user.uid)
        .child(template)
        .set(resumeDetails)
        .then(function () {
            document.getElementById('save-message-div').style.display = 'block';
            setTimeout(function () {
                document.getElementById('save-message-div').style.opacity = 0;
            }, 2500);
            setTimeout(function () {
                document.getElementById('save-message-div').style.display = 'none';
                document.getElementById('save-message-div').style.opacity = 1;
            }, 2500 + 800);
        });
    return "save successful";
}

function placementlogin() {

    var email = document.getElementById('e-mail').value,
        password = document.getElementById('password').value;

    firebase.auth().signOut();

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function () {
            window.location = "placementcell.html";
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert(errorMessage);
            // ...
        });
    return "placement login successful";
}

function printf(x) {
    console.log(x);
}

function replaceDotwithSpace(s) {
    str = new String(s);
    return str.replace(".", " ");
}

function uploadFile() {

    var file = document.getElementById('inp-file').files[0];
    var instituteid;

    if (file) {
        var filename = file.name;
        var pdf = new RegExp(".pdf");
        printf(filename);
        if (!pdf.test(filename)) {
            window.alert('please upload a pdf document');
            return "wrong format";
        }
        if (file.size > 1024000) {
            window.alert('Please upload a document of size less than 1Mb.');
            return "large size";
        }

        instituteid = replaceDotwithSpace(currentUser.email);
        printf(instituteid);
        firebase.storage().ref()
            .child(instituteid)
            .put(file);
        //pdf will be found at firebase storage


        var message = document.getElementById('message');
        message.classList.remove('invisible');
        setTimeout(() => {
            message.style.opacity = 1;
        }, 10);

        return "right format";

    } else {
        window.alert('nothing is selected!');
        return "nothing is selected";
    }

}

var x = 0;

function popRegister() {
    x = (x + 1) % 2;
    if (x == 1) {
        var reg = [];
        reg[0] = document.getElementById('formheading');
        reg[1] = document.getElementById('flname');
        reg[2] = document.getElementById('institute');
        reg[3] = document.getElementById('p');
        reg[4] = document.getElementById('forgotpswd');
        reg[5] = document.getElementById('plasignin');

        reg[0].innerText = 'Register';
        reg[0].style.fontSize = '58pt';
        setTimeout(function () {
            reg[0].style.fontSize = '38pt';
        }, 300);

        reg[1].classList.remove('invisible');
        reg[2].classList.remove('invisible');
        setTimeout(function () {
            reg[1].style.opacity = 1;
            reg[2].style.opacity = 1;
        }, 1);

        reg[3].style.fontSize = 0;
        reg[5].style.fontSize = 0;
        reg[4].style.fontSize = 0;

        setTimeout(() => {
            reg[3].style.display = 'none';
            reg[5].style.display = 'none';
            reg[4].style.display = 'none';
        }, 400);
        //reg[3].style.pheight='10px';s
    } else {
        var fname = document.getElementById('fname').value,
            lname = document.getElementById('lname').value,
            institute = document.getElementById('institute').value,
            email = replaceDotwithSpace(document.getElementById('e-mail').value),
            password = document.getElementById('password').value;

        var newinstitute = {
            'first name': fname,
            'last name': lname,
            'institute': institute,
            'email': email,
            'password': password,
        }


        if (fname == "") {
            window.alert('Enter First name.');
            x = 1;
            return;
        }
        if (lname == "") {
            window.alert('Enter Last name.');
            x = 1;
            return;
        }
        if (institute == "") {
            window.alert('Enter institute name.');
            x = 1;
            return;
        }
        /**/
        var emailid = document.getElementById('e-mail').value;
        if (!ValidateEmail(emailid)) {
            window.alert('Invalid Email id!');
            x = 1;
            return;
        }
        /**/
        if (password.length < 6) {
            window.alert('Length of password should be atleast 6 characters.');
            x = 1;
            return;
        }

        firebase.database().ref("placement cells")
            .child(institute).set(newinstitute)
            .catch(function (error) {
                window.alert(error.code);
            });

        document.getElementById('message').classList.remove('invisible');
        setTimeout(() => {
            document.getElementById('message').style.opacity = 1;
        }, 10);

    }
}


var newCellPlaceholder = 'Click to select';
function removeButtonHTML(tableid) {
    return '<button class="removeButton small-btn" onclick="removeRow(\'' + tableid + '\',this)">Remove</button>';
}

function modifiedPaste() {
    var editors = document.getElementsByClassName('input-field');
    for (var editor of editors) {
        editor.addEventListener('paste',function(e){
            e.preventDefault();

            var text = (e.originalEvent || e).clipboardData.getData('text/plain');

            this.innerText += text;
        });
    }
}

//resume addButtons utility
function addEducation() {
    
    var newrow = document.getElementById('education-table').tBodies[0].insertRow(-1);
    var cell = newrow.insertCell(0);
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = '<b>' + newCellPlaceholder + '</b>';

    cell = newrow.insertCell(-1);
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = newCellPlaceholder;

    cell = newrow.insertCell(-1);
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = newCellPlaceholder;

    cell = newrow.insertCell(-1);
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.setAttribute('class', 'text-center');
    cell.innerHTML = newCellPlaceholder;

    /*cell = newrow.insertCell(-1);
    cell.innerHTML = removeButtonHTML('education-table');*/
    // -1 is for appending at last
    //console.log('added education');
    
    modifiedPaste();
}

function addSkills() {
   
    var skilltable = document.getElementById('skills-table').tBodies[0];
    var lastrowindex = skilltable.rows.length;
    var newrow = skilltable.insertRow(lastrowindex);
    var cell = newrow.insertCell(0);
    cell.innerHTML = '<b>Technical Electives</b>';

    cell = newrow.insertCell(-1);
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = newCellPlaceholder;
    //console.log('added Skill');

    document.getElementById('add-skill').classList.add('invisible');
    document.getElementById('remove-skill').classList.remove('invisible');
    //console.log('added skills');    
    
    modifiedPaste();
}

function addInternships() {
    
    
   var internshipstable = document.getElementById('internships-table').tBodies[0];
    var lastrowindex = internshipstable.rows.length;
    var newrow = internshipstable.insertRow(lastrowindex);

    var cell = newrow.insertCell(0);
    cell.setAttribute('valign', 'top');
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = '<b>' + newCellPlaceholder + '</b>';

    cell = newrow.insertCell(-1);
    cell.setAttribute('valign', 'top');
    cell.innerHTML = '<div><p contenteditable="true" spellcheck="true" class="input-field" onclick="selectAll()">'
        + newCellPlaceholder
        + '</p></div><div><p><i>' 
        + 'Guide: ' 
        + '<span contenteditable="true" spellcheck="true" class="input-field head-field" onclick="selectAll()">'
        +  newCellPlaceholder
        + '</span>'
        + '</i></p></div>';

    cell = newrow.insertCell(-1);
    cell.setAttribute('valign', 'top');
    cell.setAttribute('class', 'w-20 text-right');
    cell.innerHTML = '<div><p contenteditable="true" spellcheck="true" class="input-field" onclick="selectAll()">'
        + newCellPlaceholder
        + '</p></div><div><p contenteditable="true" spellcheck="true" class="input-field" onclick="selectAll()">'
        + newCellPlaceholder
        + '</p><div>';

    modifiedPaste();
}

function addProjects() {
    
    var projectstable = document.getElementById('projects-table').tBodies[0];
    var lastrowindex = projectstable.rows.length;
    var newrow = projectstable.insertRow(lastrowindex);
    var cell = newrow.insertCell(0);
    cell.setAttribute('valign', 'top');
    cell.setAttribute('class', 'w-20');
    cell.innerHTML = '<div><p contenteditable="true" spellcheck="true" class="input-field" onclick="selectAll()"><b>'
        + newCellPlaceholder
        + '</b></p></div><div><p><i>' 
        + 'Guide: ' 
        + '<span contenteditable="true" spellcheck="true" class="input-field head-field" onclick="selectAll()">'
        +  newCellPlaceholder
        + '</span>'
        + '</i></p><div>';

    cell = newrow.insertCell(-1);
    cell.setAttribute('valign', 'top');
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('onclick', 'selectAll()');
    cell.setAttribute('class', 'w-60 input-field');
    cell.innerHTML = newCellPlaceholder;

    cell = newrow.insertCell(-1);
    cell.setAttribute('valign', 'top');
    cell.setAttribute('class', 'w-20 text-right');
    cell.innerHTML = '<div><p contenteditable="true" spellcheck="true" class="input-field" onclick="selectAll()">'
        + newCellPlaceholder
        + '</p></div><div><p contenteditable="true" spellcheck="true" class="input-field" onclick="selectAll()">'
        + newCellPlaceholder
        + '</p></div>';

    modifiedPaste();
}
function addSpace(element) {
    element.parentNode.innerHTML = '<br style="padding-top:2rem;">' + element.parentNode.innerHTML;
}
function removeSpace(element) {
    element.parentNode.innerHTML = '<button class="addButton" onclick="addSpace(this)">Add Space</button> <button class="removeButton" onclick="removeSpace(this)">Remove Space</button>';
}

function addtoList(list_id) {
    var list = document.getElementById(list_id);
    var cell = document.createElement('li');
    cell.setAttribute('contenteditable', "true");
    cell.setAttribute('spellcheck', 'true');
    cell.setAttribute('class', 'input-field');
    cell.setAttribute('onclick', 'selectAll()');
    cell.innerHTML = newCellPlaceholder;
    list.appendChild(cell);
}

function addAchievements() {
    document.getElementById('awards-table').style.display = 'inline';
    setTimeout(function () {
        document.getElementById('awards-table').style.opacity = 1;
        if (document.getElementById('awards-hr'))
            document.getElementById('awards-hr').style.opacity = 1;
    }, 1);
    if (document.getElementById('awards-hr'))
        document.getElementById('awards-hr').style.display = 'block';
    document.getElementById('ach-btn').classList.add('invisible');
}

//resume removeButtons utility
function removeRow(tableid, element = null) {

    var list;
    var lastrowindex;

    if (tableid == 'skills-table') {
        document.getElementById('remove-skill').classList.add('invisible');
        document.getElementById('add-skill').classList.remove('invisible');
        lastrowindex = document.getElementById(tableid).rows.length - 1;
        document.getElementById(tableid).deleteRow(lastrowindex - 1);
        return;
    } else if (tableid == 'hobbies-list') {
        list = document.getElementById('hobbies-list');
        list.removeChild(list.lastChild);
        //printf('removed');printf(list);
        return;
    } else if (tableid == 'positions-list') {
        list = document.getElementById('positions-list');
        list.removeChild(list.lastChild);
        return;
    }
    /*
    var rowindex = element.parentNode.parentNode.rowIndex;
    document.getElementById(tableid).deleteRow(rowindex);
    */
    lastrowindex = document.getElementById(tableid).rows.length - 1;
    printf(lastrowindex);
    if ((tableid != 'education-table' && lastrowindex > 1) || (tableid == 'education-table' && lastrowindex > 2))
        document.getElementById(tableid).deleteRow(lastrowindex - 1);

}

function removeAchievements() {
    document.getElementById('awards-table').style.opacity = 0;
    if (document.getElementById('awards-hr') != null)
        document.getElementById('awards-hr').style.opacity = 0;
    setTimeout(function () {
        document.getElementById('ach-btn').classList.remove('invisible');
        document.getElementById('awards-table').style.display = 'none';
        if (document.getElementById('awards-hr') != null)
            document.getElementById('awards-hr').style.display = 'none';
    }, 600);
}
