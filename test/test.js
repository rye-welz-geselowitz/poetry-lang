const interpreter = require('../interpreter');
const assert = require('assert');
const rhyme = require('rhyme-plus');

//TODO: figure out why frog/hog/fog/dog rhymes arne't working

describe('Numbers', () => {
    it('Evaluates a non-zero number',
    (done) => {
      rhyme((r)=>{
          const text = `These lines are inside the block.
          This code is as solid as a rock!`
          const actual = interpreter.interpret(text, r);
          assert.equal(actual, 2);
          done();
      })
    });
    it('Evaluates zero',
    (done) => {
      rhyme((r)=>{
          const text = `These lines are inside a block.
          Such code is as solid as a rock!`
          const actual = interpreter.interpret(text, r);
          assert.equal(actual, 0);
          done();
      })
    });
    it('Evaluates a number inside a code block',
    (done) => {
      rhyme((r)=>{
          const text = `Whose woods these are I think I know
          These lines are inside the block.
          This code is as solid as a rock!
          His house is in the village though.`
          const actual = interpreter.interpret(text, r);
          assert.equal(actual, 2);
          done();
      })
    });
});

describe('Strings', () => {
    it('Evaluates a string',
    (done) => {
      rhyme((r)=>{
          const text = `"fizz"`
          const actual = interpreter.interpret(text, r);
          assert.equal(actual, "fizz");
          done();
      })
    });
});

//TODO: throw errors for applying mathematical/boolean operations to wrong input
describe('Operations', () => {
    it('Can divide two numbers',
    (done) => {
      rhyme((r)=>{
          const text = `My favorite animal is a rock
          Rocks love to play and bark
          And they really love to go to the park
          I think your favorite animal is a block.

          Maybe your favorite animal is a cat.
          Cats clearly, clearly, clearly don't love to bark
          Or even go to the park
          I highly object to that.

          As I thought about my favorite pets
          Sock sat over the empty streets
          This world should really have more vets.
          `
          const actual = interpreter.interpret(text, r);
          assert.equal(actual, 1/3);
          done();
      })
    });
    it('Returns true when comparing a number to itself',
    (done) => {
      rhyme((r)=>{
          const text = `
          (Declare int)
          Whose woods these are I think I know
          These lines are inside the block.
          This code is as solid as a rock!
          His house is in the village though.

          (Compare int to itself)
          Grow though it is hard.

          `
          const actual = interpreter.interpret(text, r);
          assert.equal(actual, true);
          done();
      })
    });
    it('Can add two strings',
    (done) => {
      rhyme((r)=>{
          const text = `
          Oh this is so fun
          "fizz"
          I like to play in the sun

          Run, run, give me some dinner!

          `
          const actual = interpreter.interpret(text, r);
          assert.equal(actual, "fizzfizz");
          done();
      })
    });
});

describe('If/else', () => {
    it('Returns correct input if expression is true',
    (done) => {
      rhyme((r)=>{
          const text = `
          (Declare int)
          Whose woods these are I think I know
          These lines are inside the block.
          This code is as solid as a rock!
          His house is in the village though.

          (Declare another int)
          I like to sing
          Block lines are in a block.
          This code is as solid as a rock!
          Please don't make this a thing

          (Compare first int to itself)
          I really like cats
          Grow though it is hard.
          But most cats like bats

          (If/else logic)
          Rats are cool too, I guess?
          Ring in the new year
          Otherwise flow free.

          `
          const actual = interpreter.interpret(text, r);
          assert.equal(actual, 1);
          done();
      })
    });
    it('Returns correct input if expression is false',
    (done) => {
      rhyme((r)=>{
          const text = `
          (Declare int)
          Whose woods these are I think I know
          These lines are inside the block.
          This code is as solid as a rock!
          His house is in the village though.

          (Declare another int)
          I like to sing
          Block lines are in a block.
          This code is as solid as a rock!
          Please don't make this a thing

          (Compare first int to itself)
          I really like cats
          Though fling yourself around, that is the way!
          But most cats like bats

          (If/else logic)
          Rats are cool too, I guess?
          Ring in the new year
          Otherwise flow free.

          `
          const actual = interpreter.interpret(text, r);
          assert.equal(actual, 2);
          done();
      })
    });
    it('Expressions can be evaluated within if/else block ', //TODO: expand on these tests
    (done) => {
      rhyme((r)=>{
          const text = `
          (Declare int)
          Whose woods these are I think I know
          These lines are inside the block.
          This code is as solid as a rock!
          His house is in the village though.

          (Declare another int)
          I like to sing
          Block lines are in a block.
          This code is as solid as a rock!
          Please don't make this a thing

          (If/else logic)
          I really like cats
          Though fling yourself around, that is the way!
          But most cats like bats?
          I like to prance
          Block lines are in a block.
          This code is as solid as a rock!
          Please don't make this a dance
          Otherwise I like to pray
          Block lines are in a blocky block.
          This code is as solid as a rock!
          Please don't make this a day
          `
          const actual = interpreter.interpret(text, r);
          assert.equal(actual, 2);
          done();
      })
    });
});

describe('Functions', () => {
    it('Can call a function with a single parameter',
    (done) => {
      rhyme((r)=>{
          const text = `(Declare is zero function)

          So this is how we'll do it
          Under blah blah blah thunder
          (Parameter)
          Blah blah blah pole
          (Function body)
          Blah blah blah met
          blah blah blah skunk
          Blah wah wah cool
          wah wah wah school
          blah blah blah funk
          Hole punk is blah blah blah
          (End function body)
          blah blah blah pet
          blah blah blah sunder
          Please let it fit

          (Declare zero)
          Blah blah blah bar
          Blah wah wah cool
          wah wah wah school
          blah blah blah car

          (Call function)
          Sit far blah blah sing

          `
          const actual = interpreter.interpret(text, r);
          assert.equal(actual, true);
          done();
      })
    });
    it('Can call a function with multiple parameters',
    (done) => {
      rhyme((r)=>{
          const text = `(Declare sum of three numbers function)

          So this is how we'll do it
          Lance didn't dare dance
          This function takes something, doc
          And another one too
          Also a cat
          This is the body of the thing
          It makes me kind of tired
          Flock you give it a try
          I hope we don't get fired
          Hired bat give me your job.
          Don't you just want to sing?
          I don't want to prance
          Please let it fit

          (Declare 3)
          Blah blah blah bar
          Blah wah blah wah cool
          wah wah blah blah wah school
          blah blah blah car

          (Declare 1)
          Blah blah blah pug
          Blah wah wah blah cool
          wah wah wah school
          blah blah blah mug

          (Declare 2)
          Blah blah blah shut
          Blah wah wah cool
          wah wah wah blah blah school
          blah blah blah hut

          (Call function)
          Sit car hug mutt blah blah sing
          `
          const actual = interpreter.interpret(text, r);
          assert.equal(actual, 6);
          done();
      })
    });
    it('supports recursive function',
    (done) => {
      rhyme((r)=>{
          const text = `

          (Declare is zero function)

          Blah blah blah see
          Under blah blah blah thunder
          (Parameter)
          Blah blah blah pole
          (Function body)
          Blah blah blah met
          blah blah blah skunk
          Blah wah wah cool
          wah wah wah school
          blah blah blah funk
          Hole punk is blah blah blah
          (End function body)
          blah blah blah pet
          blah blah blah sunder
          Blah blah blah pee

          (Declare recursive function)

          So this is how we'll do it
          Under blah blah blah thunder
          (Parameter)
          Blah blah blah pole
          Blah blah blah met
          (Function body)

          (Declare 1)
          Blah blah blah scoop
          Blah wah wah blah cool
          wah wah wah school
          Blah blah blah poop

          (Declare n-1)
          Blah blah blah rug
          Hole hoop blah blah take blah
          Blah blah blah pug

          (If number is 0, return number)
          Blah blah blah wow
          Blah blah blah moo
          Tee role blah blah blah total
          Blah blah blah poo?
          blah blah blah skunk
          Blah wah wah cool
          wah wah wah school
          blah blah blah funk
          (Otherwise return number plus recursive call on number minus 1)
          Otherwise blah blah blah stark
          Skit mug blah blah sing
          blah blah blah park
          Blah blah blah ow


          (End function body)
          blah blah blah pet
          blah blah blah sunder
          Please let it fit

          (Declare number 3)
          Blah blah blah bar
          Blah wah blah wah cool
          wah wah blah blah wah school
          blah blah blah car

          (Call function)
          Sit car hug mutt blah blah sing
          `

          const actual = interpreter.interpret(text, r);
          assert.equal(actual, 0);
          done();
      })
    });
    it('implement crackle pop',
    (done) => {
        // Write a program that prints out the numbers 1 to 100 (inclusive).
        // If the number is divisible by 3, print Crackle instead of the number.
        // If it's divisible by 5, print Pop. If it's divisible by both 3 and 5,
        // print CracklePop. You can use any language.
      rhyme((r)=>{
          const text = `

          (Declare 10)
          We'll see how I will have fared
          Trying, trippily, to write a thing like this, a thing that's new
          Trying, truthfully, to make sure my terrible mistakes are few
          I am honestly kind of scared


          (Declare 100)
          My courage is shrinking
          Scared? Scared. I need to do this thing by myself...
          My heart is sinking


          (Declare 0)
          Blah blah blah hug
          Coding great
          Oh so late
          Blah blah blah mug

          (Declare 1)
          Blah blah blah skilled
          Blah wah wah blah cool
          wah wah wah school
          Blah blah blah filled

          (Declare 3)
          I may be up until night gives way to sun
          Coding is cool, so cool, so great
          But the clock is showing that it's pretty late
          I wish this were a bit more fun

          (Declare 5)
          Staying up at night by the light of the moon
          When will I sleep, where will I sleep, where is my bed
          Tomorrow will I be able to keep my head?
          Please let this be over soon!

          (Divisible by function)
          Blah blah blah soup.
          Hope with me that this isn't out of scope
          I want everything to go well.
          I want everything to be nice.
          I don't know how to do this thing

          blah blah blah cat
          Swell mice leave blah blah blah
          blah blah blah bat

          Fat shrug is blah blah blah

          It would help if I could sing.
          I wish I had a bit of rope
          Blah blah blah loop

          (Declare string function)
          We're getting into the hard part.
          Hope with me that this isn't out of scope
          I like my name.
          I don't know how to do this thing

          (Crackle)
          Blah blah blah cold
          Blah blah blah mumble
          Loop tame fun lobster
          Blah blah blah fumble?
          blah blah blah mine
          "Crackle"
          blah blah fine
          Otherwise blah blah blah mine
          ""
          blah blah blah fine
          Blah blah blah fold

          (Pop)
          Blah blah blah cool
          Blah blah blah mumble
          Loop tame soon lobster
          Blah blah blah fumble?
          blah blah blah mine
          "Pop"
          blah blah fine
          Otherwise blah blah blah mine
          ""
          blah blah blah fine
          Blah blah blah fool

          (Add)
          Blah blah blah chill
          Fold fool blah give blah
          Blah blah blah bill

          Blah blah blah lost
          ""
          Blah blah blah cost

          Blah blah blah tight
          ". "
          Blah blah blah light

          Blah blah blah lump
          Blah blah blah sing
          Bill cost is blah blah blah
          Blah blah blah king?
          Blah blah blah sing
          Bill tame give blah blah blah
          Blah Blah Blah king
          Otherwise blah blah blah sing
          Bill cost give blah blah blah
          Blah blah blah king
          Blah blah blah hump

          blah blah blah walking
          hump light give blah blah
          blah blah blah talking

          It would help if I could sing.
          I wish I had a bit of rope
          Or maybe that I were a bit more smart.

          (Declare recursive function)
          So this is how we'll do it
          Under blah blah blah thunder
          (Parameter)
          Blah blah blah pole
          Blah blah blah met
          (Function body)

          (Declare n-1)
          Blah blah blah poodle
          Hole filled blah blah take blah
          Blah blah blah oodle

          (Declare crackle/pop/whatever)
          Blah blah blah miss
          Smart soul soggy
          Blah blah blah kiss

          Blah blah blah say
          Blah blah blah singing
          Mug oodle is blah blah blah
          Blah blah blah ringing?
          blah blah blah skunk
          ""
          blah blah blah funk
          Otherwise blah blah blah stark
          Blah blah blah ball
          Skit oodle blah blah sing
          Blah blah blah fall
          blah blah blah park
          Blah blah blah day

          Day kiss give blah blah

          (End function body)
          blah blah blah pet
          blah blah blah sunder
          Please let it fit

          Sit sinking hug mutt blah blah sing
          `

          const actual = interpreter.interpret(text, r);
          const expected = `1. 2. crackle. 4. pop. crackle. 7. 8. crackle. pop. 11. crackle. 13. 14. cracklepop. 16. 17. crackle. 19. pop. crackle. 22. 23. crackle. pop. 26. crackle. 28. 29. cracklepop. 31. 32. crackle. 34. pop. crackle. 37. 38. crackle. pop. 41. crackle. 43. 44. cracklepop. 46. 47. crackle. 49. pop. crackle. 52. 53. crackle. pop. 56. crackle. 58. 59. cracklepop. 61. 62. crackle. 64. pop. crackle. 67. 68. crackle. pop. 71. crackle. 73. 74. cracklepop. 76. 77. crackle. 79. pop. crackle. 82. 83. crackle. pop. 86. crackle. 88. 89. cracklepop. 91. 92. crackle. 94. pop. crackle. 97. 98. crackle. pop.`
          assert.equal(actual.trim(), expected.trim());
          done();
      })
    });
});
