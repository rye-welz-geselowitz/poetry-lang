const text1=
`(This code should evaluate to 2.)
These lines are inside the block.
This code is as solid as a rock!`

const text2=
`
(This code should evaluate to 1/3)
My favorite animal is a rock
Rocks love to play and bark
And they really love to go to the park
I think your favorite animal is a block.

Maybe your favorite animal is a cat.
Cats clearly, clearly, clearly don't love to bark
Or even go to the park
I highly object to that.

Sock sat over the empty streets
`

const text3 =
`(Should return 1)

(Declare int, 2)
Whose woods these are I think I know
These lines are inside the block.
This code is as solid as a rock!
His house is in the village though.

(Declare another int, 1)
I like to sing
Block lines are in a block.
This code is as solid as a rock!
Please don't make this a thing

(Compare first int to itself)
I really like cats
Grow though it is hard.
But most cats like bats

(If the previous expression was true, return 1, otherwise 2)
Rats are cool too, I guess?
Ring in the new year
Otherwise flow free.`

const text4 = `(Function evaluating whether a number is equal to zero - should return true)

(Declare is zero function)

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

const text5 = `(Crackle pop)


(Write a program that prints out the numbers 1 to 100 (inclusive).)
(If the number is divisible by 3, print Crackle instead of the number.)
(If it's divisible by 5, print Pop. If it's divisible by both 3 and 5,)
(print CracklePop. You can use any language.)

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
const examples =
    [{text: text1, display: 'Number'},
      {text: text2, display: 'Division'},
      {text: text3, display: 'If/Else'},
      {text: text4, display: 'Function'},
      {text: text5, display: 'Crackle Pop'}

  ]
examples.forEach((ex)=> {
    let btn = document.createElement('button');
    let t = document.createTextNode(ex.display);
    btn.appendChild(t)
    btn.onclick = () => {
        $('#input').val(ex.text)
    }
    var parent = document.getElementById('example-btns')
    parent.appendChild(btn);
})

  const runButton = $('#run-btn');
  runButton.click(()=> {
      const sourceCode = $('#input').val();
      $.post( "http://localhost:3000/interpret", {text: sourceCode}, function( data ) {
        $('#output').val(data.result)
      });
  })
