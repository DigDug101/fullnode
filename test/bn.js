var chai = chai || require('chai');
var should = chai.should();
var assert = chai.assert;
var BN = require('../lib/bn');

describe('BN', function() {
  it('should create a bn', function() {
    var bn = new BN(50);
    should.exist(bn);
    bn.toString().should.equal('50');
    bn = BN(50);
    bn.toString().should.equal('50');
    (bn instanceof BN).should.equal(true);
    bn = BN('ff00', 16);
    bn.toString(16).should.equal('ff00');
    bn = new BN('ff00', 16);
    bn.toString(16).should.equal('ff00');
  });

  it('should parse this number', function() {
    var bn = BN(999970000);
    bn.toString().should.equal('999970000');
  });

  it('should parse numbers below and at bn.js internal word size', function() {
    var bn = BN(Math.pow(2, 26) - 1);
    bn.toString().should.equal((Math.pow(2, 26) - 1).toString());
    var bn = BN(Math.pow(2, 26));
    bn.toString().should.equal((Math.pow(2, 26)).toString());
  });

  describe('#copy', function() {
    
    it('should copy 5', function() {
      var bn = BN('5');
      var bn2;
      (function() {
        bn.copy(bn2);
      }).should.throw(); //bn2 is not a BN yet
      bn2 = BN();
      bn.copy(bn2);
      bn2.toString().should.equal('5');
    });

  });
  
  describe('#add', function() {

    it('should add two small numbers together', function() {
      var bn1 = BN(50);
      var bn2 = BN(75);
      var bn3 = bn1.add(bn2);
      bn3.toString().should.equal('125');
    });

  });

  describe('#sub', function() {

    it('should subtract a small number', function() {
      var bn1 = BN(50);
      var bn2 = BN(25);
      var bn3 = bn1.sub(bn2);
      bn3.toString().should.equal('25');
    });

  });

  describe('#eq', function() {

    it('should know A=B', function() {
      BN(5).eq(5).should.equal(true);
      BN(5).eq(4).should.equal(false);
    });

  });

  describe('#neq', function() {

    it('should know A!=B', function() {
      BN(5).neq(5).should.equal(false);
      BN(5).neq(4).should.equal(true);
    });

  });

  describe('#gt', function() {

    it('should say 1 is greater than 0', function() {
      var bn1 = BN(1);
      var bn0 = BN(0);
      bn1.gt(bn0).should.equal(true);
    });

    it('should say a big number is greater than a small big number', function() {
      var bn1 = BN('24023452345398529485723980457');
      var bn0 = BN('34098234283412341234049357');
      bn1.gt(bn0).should.equal(true);
    });

    it('should say a big number is great than a standard number', function() {
      var bn1 = BN('24023452345398529485723980457');
      var bn0 = BN(5);
      bn1.gt(bn0).should.equal(true);
    });

  });

  describe('#geq', function() {

    it('should know that A >= B', function() {
      BN(6).geq(5).should.equal(true);
      BN(5).geq(5).should.equal(true);
      BN(4).geq(5).should.equal(false);
    });

  });

  describe('#lt', function() {
    
    it('should know A < B', function() {
      BN(5).lt(6).should.equal(true);
      BN(5).lt(4).should.equal(false);
    });

  });

  describe('#leq', function() {
    
    it('should know A <= B', function() {
      BN(5).leq(6).should.equal(true);
      BN(5).leq(5).should.equal(true);
      BN(5).leq(4).should.equal(false);
    });

  });

  describe('#fromJSON', function() {
    
    it('should make BN from a string', function() {
      BN().fromJSON('5').toString().should.equal('5');
    });

  });

  describe('#toJSON', function() {
    
    it('should make string from a BN', function() {
      BN(5).toJSON().should.equal('5');
      BN().fromJSON('5').toJSON().should.equal('5');
    });

  });

  describe('#fromString', function() {
    
    it('should make BN from a string', function() {
      BN().fromString('5').toString().should.equal('5');
    });

  });

  describe('#toString', function() {
    
    it('should make a string', function() {
      BN(5).toString().should.equal('5');
    });

  });

  describe('@fromBuffer', function() {
    
    it('should work with big endian', function() {
      var bn = BN.fromBuffer(new Buffer('0001', 'hex'), {endian: 'big'});
      bn.toString().should.equal('1');
    });

    it('should work with big endian 256', function() {
      var bn = BN.fromBuffer(new Buffer('0100', 'hex'), {endian: 'big'});
      bn.toString().should.equal('256');
    });

    it('should work with little endian if we specify the size', function() {
      var bn = BN.fromBuffer(new Buffer('0100', 'hex'), {size: 2, endian: 'little'});
      bn.toString().should.equal('1');
    });

  });

  describe('#fromBuffer', function() {

    it('should work as a prototype method', function() {
      var bn = BN().fromBuffer(new Buffer('0100', 'hex'), {size: 2, endian: 'little'});
      bn.toString().should.equal('1');
    });
  
  });

  describe('#toBuffer', function() {
    
    it('should create a 4 byte buffer', function() {
      var bn = BN(1);
      bn.toBuffer({size: 4}).toString('hex').should.equal('00000001');
    });

    it('should create a 4 byte buffer in little endian', function() {
      var bn = BN(1);
      bn.toBuffer({size: 4, endian: 'little'}).toString('hex').should.equal('01000000');
    });

    it('should create a 2 byte buffer even if you ask for a 1 byte', function() {
      var bn = BN('ff00', 16);
      bn.toBuffer({size: 1}).toString('hex').should.equal('ff00');
    });

    it('should create a 4 byte buffer even if you ask for a 1 byte', function() {
      var bn = BN('ffffff00', 16);
      bn.toBuffer({size: 4}).toString('hex').should.equal('ffffff00');
    });

  });

  describe('#toSM', function() {
    
    it('should convert to SM', function() {
      var buf;
      buf = BN().toSM();
      buf.toString('hex').should.equal('');
      buf = BN(5).toSM();
      buf.toString('hex').should.equal('05');
      buf = BN(-5).toSM();
      buf.toString('hex').should.equal('85');
      buf = BN(128).toSM();
      buf.toString('hex').should.equal('0080');
      buf = BN(-128).toSM();
      buf.toString('hex').should.equal('8080');
      buf = BN(127).toSM();
      buf.toString('hex').should.equal('7f');
      buf = BN(-127).toSM();
      buf.toString('hex').should.equal('ff');
      buf = BN(128).toSM({endian: 'little'});
      buf.toString('hex').should.equal('8000');
      buf = BN(-128).toSM({endian: 'little'});
      buf.toString('hex').should.equal('8080');
    });

  });

  describe('#fromSM', function() {
    
    it('should convert from SM', function() {
      var buf;
      buf = new Buffer([0]);
      BN().fromSM(buf).cmp(0).should.equal(0);
      buf = new Buffer('05', 'hex');
      BN().fromSM(buf).cmp(5).should.equal(0);
      buf = new Buffer('85', 'hex');
      BN().fromSM(buf).cmp(-5).should.equal(0);
      buf = new Buffer('0080', 'hex');
      BN().fromSM(buf).cmp(128).should.equal(0);
      buf = new Buffer('8080', 'hex');
      BN().fromSM(buf).cmp(-128).should.equal(0);
      buf = new Buffer('8000', 'hex');
      BN().fromSM(buf, {endian: 'little'}).cmp(128).should.equal(0);
      buf = new Buffer('8080', 'hex');
      BN().fromSM(buf, {endian: 'little'}).cmp(-128).should.equal(0);
      buf = new Buffer('0080', 'hex'); //negative zero
      BN().fromSM(buf, {endian: 'little'}).cmp(0).should.equal(0);
    });

  });

  describe('#toScriptNumBuffer', function() {

    it('should output a little endian SM number', function() {
      var bn = BN(-23434234);
      bn.toScriptNumBuffer().toString('hex').should.equal(bn.toSM({endian: 'little'}).toString('hex'));
    });

  });

  describe('#fromScriptNumBuffer', function() {
    
    it('should parse this normal number', function() {
      BN().fromScriptNumBuffer(new Buffer('01', 'hex')).toNumber().should.equal(1);
      BN().fromScriptNumBuffer(new Buffer('0080', 'hex')).toNumber().should.equal(0);
      BN().fromScriptNumBuffer(new Buffer('0180', 'hex')).toNumber().should.equal(-1);
    });

    it('should throw an error for a number over 4 bytes', function() {
      (function() {
        BN().fromScriptNumBuffer(new Buffer('8100000000', 'hex')).toNumber().should.equal(-1);
      }).should.throw('script number overflow');
    });

    it('should throw an error for number that is not a minimal size representation', function() {
      //invalid
      (function() {
        BN().fromScriptNumBuffer(new Buffer('80000000', 'hex'), true);
      }).should.throw('non-minimally encoded script number');
      (function() {
        BN().fromScriptNumBuffer(new Buffer('800000', 'hex'), true);
      }).should.throw('non-minimally encoded script number');
      (function() {
        BN().fromScriptNumBuffer(new Buffer('00', 'hex'), true);
      }).should.throw('non-minimally encoded script number');

      //valid
      BN().fromScriptNumBuffer(new Buffer('8000', 'hex'), true).toString().should.equal('128');
      BN().fromScriptNumBuffer(new Buffer('0081', 'hex'), true).toString().should.equal('-256');
      BN().fromScriptNumBuffer(new Buffer('', 'hex'), true).toString().should.equal('0');
      BN().fromScriptNumBuffer(new Buffer('01', 'hex'), true).toString().should.equal('1');

      //invalid, but flag not set
      BN().fromScriptNumBuffer(new Buffer('00000000', 'hex')).toString().should.equal('0');
    });

  });

  describe('#fromNumber', function() {

    it('should convert from a number', function() {
      BN().fromNumber(5).toNumber().should.equal(5);
    });

  });

  describe('#toNumber', function() {

    it('it should convert to a number', function() {
      BN(5).toNumber().should.equal(5);
    });

  });

});
