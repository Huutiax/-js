var a = {}, b = Object.prototype;
console.log(a.prototype===b,Object.getPrototypeOf(a)===b);