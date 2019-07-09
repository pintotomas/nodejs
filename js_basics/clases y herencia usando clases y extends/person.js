class Person {
  constructor(first, last, age, gender, interests) {
    this.name = {
      first,
      last
    };
    this.age = age;
    this.gender = gender;
    this.interests = interests;
  }

  greeting() {
    console.log(`Hi! I'm ${this.name.first}`);
  };

  farewell() {
    console.log(`${this.name.first} has left the building. Bye for now!`);
  };
}

let han = new Person('Han', 'Solo', 25, 'male', ['Smuggling']);
han.greeting();
// Hi! I'm Han

let leia = new Person('Leia', 'Organa', 19, 'female', ['Government']);
leia.farewell();
// Leia has left the building. Bye for now

class Teacher extends Person {
  constructor(first, last, age, gender, interests, subject) {
    super(first, last, age, gender, interests);

    // subject and grade are specific to Teacher
    this.subject = subject;
  }

  qualify(alumno, grade) {
    alumno.grade = grade
  }
}

class Alumno extends Person {
  constructor (first, last, age, gender, interests, grade) {
    super(first, last, age, gender, interests);
    this.grade = grade
  }

}

let snape = new Teacher('Severus', 'Snape', 58, 'male', ['Potions'], 'Dark arts');
snape.greeting(); // Hi! I'm Severus.
snape.farewell(); // Severus has left the building. Bye for now.
console.log(snape.age) // 58
console.log(snape.subject); // Dark arts

let alumno = new Alumno('Juan', 'Carlos', 23, 'male', ['LOL'], undefined)
console.log(alumno.grade)
snape.qualify(alumno, 5)
console.log(alumno.grade)