const bcrypt = require('bcrypt'); // npm install bcrypt

const saltRounds = 10;//broj prolaza hashiranja
const plainPassword = "adi123";

bcrypt.genSalt(saltRounds, (error, salt)=>{
    bcrypt.hash(plainPassword, salt, (error, hashedPassword)=>{
        if(error){
            console.log(`Problem: ${error}`);
        }
        console.log(`Lozinka koju treba snimiti u bazu: ${hashedPassword}`);
    })
});


const storedPassword = '$2b$10$x.OPkKOX6jE.wQYR7y5ttOTPXN.azH5ohv9WdZXtHl9kM2eTXDhky';

bcrypt.compare(plainPassword, storedPassword, (error, result)=>{
    if(error){
        console.log(`Problem: ${error}`);
    }else{
        if(result){
            console.log('Lozinke odgovaraju jedna drugoj');
        }else{
            console.log('Lozinke ne odgovaraju jedna drugoj');
        }
    }
});