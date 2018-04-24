const interpreter = require('../interpreter');
const assert = require('assert');
const rhyme = require('rhyme-plus');


describe('Integers', () => {
    it('should evaluate integer based on the number of words alliterative with the first word',
    (done) => {
      rhyme((r)=>{
          const text = `
            Whose woods these are I think I know!
            His house is in the village though
          `
          assert.equal(1, interpreter.interpret(text, r));
          done();
      })

    });
    it('includes alliteration in the second line',
    (done) => {
      rhyme((r)=>{
          const text = `
            Whose woods these are I think I know!
            His winsome house is in the wild village though
          `
          assert.equal(3, interpreter.interpret(text, r));
          done();
      })

    });
    it('Can add two integers',
    (done) => {
      rhyme((r)=>{
          const text = `
            Whose woods these are I think I know
            His house is in the village though

            Oh, ow, I just really hurt my heel
            But not as badly, ow, as I hurt this poem, I feel

            The discrepancies only grow and grow
            The badness of this poem is real
          `
          assert.equal(3, interpreter.interpret(text, r));
          done();
      })

    });
});
