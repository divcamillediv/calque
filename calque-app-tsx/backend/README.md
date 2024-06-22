# Backend 

## Exigences 

 - Authentification and encryption of user data
 - Create an API (Rest) to query the database with the essential CRUD features.


## Setting up the project after cloning

 *If you've just cloned the project, you can simply install the dependencies to get started :* <br>

 1. Install dependencies stored in package.json. The following command will create and add content in node_modules, make sure you are in the backend directory and use the console to type :<br>
 `npm install ` 

 2. Compile the .ts files into .js files to the ./dist folder via the following node.js script : <br>
 `npm run build ` <br>
 *or if you have typescript installed globally, you can use :*<br>
  `tsc`<br>
 The typescript files are compiled to js and put in the ./dist folder. You can change the destination in tsconfig.json the "outDir" line.



## Setting up the project for the first time

 0. Files : <br>
 *Create index.ts* <br>
 *Create .env* <br>
 *Create .gitignore* <br>
 *Create config.ts* <br>
 *Create src/* <br>
 *Create dist/* <br>

 1.  Prepare the Node.js dependencies : <br>
 *In console, change directory to the backend and prepare it for Node.js*  <br>
 `npm init -y `  <br>
 Will add package.json.  <br>

 2. Prepare the Express.js dependencies :  <br>
 *In console, change directory to the backend and prepare it for Express.js* <br>
 `npm i express `  <br>
 Will add content in node_modules, package-lock.json and also update package.json. <br>

 3. Prepare the Mongoose dependencies :  <br>
 *In console, change directory to the backend.* <br>
 `npm i mongoose `  <br>
 Will add content in node_modules, package-lock.json and also update package.json. <br>

 4. Prepare the MongoDB dependencies : <br>
 *In console, change directory to the backend.* <br>
 `npm install mongodb`
 Will add content in node_modules, package-lock.json and also update package.json. <br>

 5. Development dependencies :  <br>
 *In console, change directory to the backend.* <br>
 `npm i --save-dev dotenv nodemon typescript @types/node`  <br>
 Will add Dotenv to manage environement variables.  <br>
 Will add Nodemon to refresh the server automatically while applying changes. <br>
 Will add Typescript to the project. <br>
 Will add @type/nodes to the project. <br>
 Will add content in node_modules, package-lock.json and also update package.json. <br>

 6. Prepare the .gitignore : <br>
 *In .gitignore, add the lines:* <br>
 `.env ` <br>
 `node_modules `  <br>
 If you need to install depedencies, use "npm -install", and the dependencies will be automatically installed via package.json <br>

 6. Scripts : <br>
 *In package.json, add the following lines in the script list:* <br>
 `"serverStart" : nodemon index.js, ` <br>
 ` "build" : tsc ` <br>



### Ressources used :

 - https://www.youtube.com/watch?v=P6RZfI8KDYc&list=PL_cUvD4qzbkwjmjy-KjbieZ8J9cGwxZpC
 - https://www.youtube.com/watch?v=_7UQPve99r4



## Timeline <br>
 *DD-MM-YYYY* <br>
 18-06-2024 : Configuring the MongoDB for the first time; <br>
 20-06-2024 : Setting up the folder with the following ; <br>



## Notes on typescript:
 - Regular Javascript can be written in a typescript file. It will be transpiled as is.
 - ` const variable1 = ...; ` assures immutability.
 - ` let variable2 = ...; ` allows mutability.
 - ` let variable2 : "value" = ...; ` limit to a value;
 - ` let variable3 : any = ...;` explicitely allows all types;
 - ` let variable4 = <type> variable3; ` converts an any type to a specific type. Type assertion will not influence the behavior of the variable, because assertion annotations are removed at compilation.
 - ` let variable5 = <interface> { }; ` converts an undefined object to a specific object.
 - ` const variable6 = variable1 as type ` specifies a type onto a more specific one.
 - `const variable7 = variable1 as any as type` another assertion method.
 - ` type NomType = { var1:type1; var2:type2;} ` allow struct like behavior.
 - ` type NomType = ... | ... | ... ; ` allows custom datatypes with finite possibilities (narrowing).
 - ` function fx1(): value1 | value2 | value3 {} ` narrows the possible inputs to a function.
 - ` interface Interface1{ variable1: value1 | value2; } ` narrows the possible inputs to an interface attribute.
 - Javascript types: ` number, string, boolean, null, undefined, object `
 - Typescript additional types: `any, unknown, never, enum, tuple`
 - `let var1 : number = 1_000_000;` increases readability of large numbers.
 - `let variable;` will initiate with type any.
 - `function fx1(arg1){}` will assume arg1 is of type any.
 - `let array1: type[] = [value1, value2, value3...];` array of a specific type.
 - `let array2: [type1,type2] = [...,...];` tuple-like behavior.
 - `enum list1 {const1 = ..., const2 = ..., const3=...}` enum-like behavior allows list of const variables.
 - `function fx():void{...;}` will return void.
 - `function fx(){...;}` if no return, will return void.
 - `function fx(){return value:type;}` signature will take type of the return value.
 - `function fx():type{...;}` if no return, will return undefined.
 - `function fx():type{return value;}` expected behavior, will return explicitly specified type.
 - `function fx(arg? : type){...;}` will make the argument facultative, will supply undefined by default.
 - `function fx(arg = value){...;}` will make the argument facultative with a default value.
 - `let object:{attribute1:type, attribute2?:type}` will make the attribute2 facultative upon instanciation.
 - `let object:{readonly attribute:type}` will make the attribute immutable.
 - `let object:{fx1 (arg1:type)=>void}` will expect a function with the matching signature upon instanciation 
 - `type CustomType = { }` define a custom type, will allow reusability of objects.
 - `let var1 : CustomType = {...;}` new object instance.
 - `function fx(arg1: type1 | type2){...}` union type for arg1. Intellisense will only show common methods. Narrowing will allow to access type specific methods.
 - `function fx(arg1: type1 | null | undefined){...}` allows null and undefined values to be passed to the fx.
 - `type CustomType = type1 & type2;` intersection type will create a type combining both attributes and methods.
 - `object?.attribute` will access the attribute only if the object is not null and not undefined.
 - `object.attribute?.` will access the attribute only if the attribute is not null and not undefined.
 - `fx?.(...);` will execute the method only if the function is not null or undefined.
 - `function fx1( array: (type1|type2)[]{...} )` allows input of array of type1 and type2. The signature will reflect that with the union type.
 - `function fx1<GenericType>( array: GenericType[]{...} )` allows the return value to be of the exact same type as the function input. Generic is not declared, it is a placeholder.
 - `const var1 = fx1<Number>(arg1);` Will specify the type of the arg1 such that the output and signature will match.
 - `type CustomType<Generic> = { attribute : Generic;}` will allow the type to be specified upon instanciation.
 - `Const var1 : CustomType<{attribute:number}> = {...}` specifies the generic type. 
 - `type CustomType<Generic extends Type> = { attribute : Generic;}` will allow the type to be specified upon instanciation but will have to be belong to the type hierarchy .

### References:
 - www.youtube.com/watch?v=d56mG7DezGs "1h Introduction"
 - https://www.typescriptlang.org/docs/ "Typescript Documentation"
 - https://www.youtube.com/watch?v=EcCTIExsqmI "Generic types"