class Person {

    name:string
    age:number

    constructor(name,age) {
        this.name = name
        this.age=age
    }
    speak(){
        console.log(`我的名字是${this.name},我的年龄是${this.age}`);
    }
}

const p1 = new Person('Mac',11)
p1.speak();