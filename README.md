NOTE: This README (and this interpreter) are WIPs!

# Code Blocks
A code block is the code contained between two lines whose final words rhyme.

```
Whose woods these are I think I know
These lines are inside the block.
This code is as solid as a rock!  
His house is in the village though.
```

Code blocks can be nested within each other.

In the following example, whitespace is included for convenience. The outer block is wrapped by the "know"/"though" rhyme. It contains two inner blocks, wrapped by "dog"/"frog" and "cat"/"that" respectively.

```
Whose woods these are I think I know


My favorite animal is a dog
These lines are inside the block.
This code is as solid as a rock!  
I think your favorite animal is a frog.

Maybe your favorite animal is a cat.
These lines are inside the block.
This code is as solid as a rock!  
I highly object to that.


His house is in the village though.
```


# Integers
An integer is expressed through a couplet (two lines whose final words rhyme).
The value of the integer is equal to the number of words in the couplet that are alliterative (naive definition: start with the same letter) with the first word.

This code evaluates to 0, because no words are alliterative with the opening "I":
```
I am a dog
who loves the fog.
```


This code evaluates to 2, because two words ("don't", "dance") are alliterative with the opening "Dogs":
```
Dogs don't like to prance
But puppies like to dance

```
# Strings
A string can be expressed in a single line wrapped in quotes.

# Bindings
Scope is defined by code blocks. Within a code block, the programmer can access the evaluation of any prior block by making a rhyme with the last words of its containing lines. For examples, see the sections below.

# Binary Operations
A number of binary operations, listed below, are available. Some can be performed on numbers, while others can be performed on booleans.

A binary operation is expressed in a single line. It must be performed upon previously evaluated expressions. The first expression is referenced (by rhyme) in the first word of the line. The second expression is referenced (by rhyme) in the second word of the line. The operation is expressed through the inclusion of the following English words elsewhere in the line:

Numerical:
 * Multiplication - "by"
 * Division - "over"
 * Addition - "give"
 * Subtraction - "take"
 * Modulo operation - "leave"
 * Equality comparison - "is"
 * Greater than - "more"
 * Less than - "less"

Boolean:
  * And - "and"
  * Or - "or"

In the following example, the first stanza ("My favorite...a frog") binds the integer 2 to the "dog/frog" rhyme. The second stanza ("Maybe our... to that") binds the integer 2 to the "cat/that" rhyme. The third code block contains the binary operation (2 / 1). The first expression (2) is referenced by "fog" through the rhyme with "frog." The second expression (1) is referenced by "sat" through the rhyme with "cat." The operation is established by the inclusion of they keyword "over," which references the division operation.

```
My favorite animal is a dog
They love to play and bark
They love to go to the park
I think your favorite animal is a frog.

Maybe your favorite animal is a cat.
Cats love to grumble and complain
Or just sit and watch the rain
I highly object to that.

As I thought about my favorite pets
Fog sat over the empty streets
This world should really have more vets.
```

# If / else
An if/else evaluation is expressed in 3 or more lines where a line ends with "?" and another line begins with the words "else" or "otherwise"

If/else logic can be performed on already-bound expressions. Three expressions must be referenced: (1) an expression that evaluates to true or false (2) an expression that will be the outcome if the expression is true (3) an expression that will be the outcome if the expression is false. In the following code block, assume that "Dogs" is a rhyme reference to "true," "cats" is a rhyme reference to 3, and "frogs" is a rhyme reference to 4.
```
Dogs are the best animal?
Cats don't agree with that
Otherwise frogs would fight them.
```
The above expression evaluates to 3.

If/else logic can also be performed on non-bound expressions

```
I like dogs
<code that evaluates to true>
but do you like frogs?
I believe I like cats
<code that evaluates to 3>
But it seems you like rats
Otherwise I would like horses
<code that evaluates to 4>
But that would invoke mystic forces.  
```


# Functions

Functions are wrapped within a first and last line whose final words rhyme. The first line is marked by an internal rhyme between its first and last word
Parameters are declared by the lines following the function declaration. These parameters can afterwards be referenced by rhyming the last word in their representative lines.
The function body is set apart as a code block (in this case "thing/sing").
The function will return the last evaluated expression.
This function takes three numbers and adds them.
```
Lance didn't dare dance
This function takes some number
And another one too
Also a third
This is the body of the thing
It makes me kind of tired
Slumber, you, give it a try
I hope we don't get fired
Hired bird, give me your job.
Don't you just want to sing?
I don't want to prance
```

Calling a function is accomplished in a single line. The function being called is referenced with the first word (by rhyming the function grouping), and arguments are provided with subsequent words, also by rhyming with bound evaluated expressions. All terms after the parameters must be entirely alliterative with one another. TODO: update!! first and last words must be alliterative

For example, the following line calls the above function, with the parameters referencing previously bound expressions via rhymes with "made," "me," and "so."
```
Chance made me so angry and able.
```

# Comments
Any single line between parentheses will be ignored as a comment.

# Printing
You can print at any time by including a line in the following form:
`O, <thing to print>`
The printable thing can be either a reference to a previously bound expression, or a string.

# Print numbers 100 to 1
```
(Declare is zero function)
Under blah blah blah thunder
Blah blah blah pole
Blah blah blah met
blah blah blah skunk
Blah wah wah wah
wah wah wah wah
blah blah blah funk
Foal punk is blah blah blah
blah blah blah pet
blah blah blah sunder

(Declare recursive function.)
Foo blah blah blah boo
(Parameters)
Blah blah blah bar

(Function body)
Blah blah blah cat
O, far!

(Check if at zero)
blah blah blah shit
Thunder far blah is blah sunder
blah blah blah fit?
(If at zero, return)
blah blah blah rope
"I'm done with this!"
blah blah blah hope
(Otherwise...)
Else blah blah blah blah roam
(Declare 1)
blah blah blah cool
Blah blah wah wah wah
wah wah wah wah
blah blah blah pool

(Declare new n)
blah blah blah cuddle
Far stool blah blah take blah blah
blah blah blah muddle

(Call recursive function)
Moo huddle blah blah blah blah
blah blah blah foam

Blah blah blah mat
(End function body)

Blah blah blah moo
(End function)


(Bind 100)
Blah blah blah snow
Blah blah blah blah blah blah cold
blah blah blah blah blah fold
Blah blah blah flow

Blah blah blah fun
Crow, go by blah blah blah
Blah blah blah sun

(Call recursive function.)
Coo shun blah blah loo

```
