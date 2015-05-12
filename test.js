var mccjs = require("./mccjs");
var assert = require("assert")

function range(start, stop, step){
    if (typeof stop=='undefined'){
        // one param defined
        stop = start;
        start = 0;
    };
    if (typeof step=='undefined'){
        step = 1;
    };
    if ((step>0 && start>=stop) || (step<0 && start<=stop)){
        return [];
    };
    var result = [];
    for (var i=start; step>0 ? i<stop : i>stop; i+=step){
        result.push(i);
    };
    return result;
};

/* 
var monthNames = {
  1: 'တခူး',
  2: 'ကဆုန်',
  3: 'နယုန်',
  4: 'ဝါဆို',
  7: 'ဝါခေါင်',
  8: 'တော်သလင်း',
  9: 'သတင်းကျွတ်',
  10: 'တန်ဆောင်မုန်း',
  11: 'နတ်တော်',
  12: 'ပြာသို',
  13: 'တပို့တွဲ',
  14: 'တပေါင်း'
}


1 | Tagu? | တခူး
2 | Kason | ကဆုန်
3 | Nayon | နယုန်
4 | Waso  | ဝါဆို
5
6 
7 | Wagaung | ဝါခေါင်
8 | Tawthalin | တော်သလင်း
9 | Thadingyut? | သတင်းကျွတ်
10 | Tazaungmon | တန်ဆောင်မုန်း
11 | Nadaw | နတ်တော်
12 | Pyatho | ပြာသို
13 | Tabodwe | တပို့တွဲ
14 | Tabaung | တပေါင်း
*/

// var months=["1st Waso","Tagu","Kason","Nayon","Waso","Wagaung","Tawthalin", "Thadingyut","Tazaungmon","Nadaw","Pyatho","Tabodwe","Tabaung"];


// for month number > 6, remove 2.


describe('Convertions', function(){
  describe('greg to myan', function(){
    it('should be identical to the value of mmcalendar 1', function(){
      var myCal = mccjs.g2m(2013, 10, 1);
      assert.equal(myCal.my, 1375); // ၁၃၇၅
      assert.equal(myCal.mm, 8-2); // တော်သလင်း
      assert.equal(myCal.md, 27); // ၁၂   
    })
    it('should be identical to the value of mmcalendar 2', function(){
      var myCal = mccjs.g2m(2013, 10, 14);
      assert.equal(myCal.my, 1375); // ၁၃၇၅
      assert.equal(myCal.mm, 9-2); // တော်သလင်း
      assert.equal(myCal.md, 10); // ၁၀
    })
    it('should be identical to the value of mmcalendar 3 with the fix (new year begin after the new year festival)', function(){
      var myCal = mccjs.g2m(2013, 4, 14); 
      assert.equal(myCal.my, 1375-1); // ၁၃၇၅
      assert.equal(myCal.mm, 1); // တခူး
      assert.equal(myCal.md, 4); // ၄  
    })
    it('should be identical to the value of mmcalendar 4', function(){
      var myCal = mccjs.g2m(2010, 7, 15);
      assert.equal(myCal.my, 1372); // ၁၃၇၂
      assert.equal(myCal.mm, 6-2); //  ဒုတိယဝါဆို
      assert.equal(myCal.md, 4); // ၄  
    })
    it('should be identical to the value of mmcalendar 5', function(){
      var myCal = mccjs.g2m(2010, 7, 16); 
      assert.equal(myCal.my, 1372); // ၁၃၇၂
      assert.equal(myCal.mm, 6-2); // ဒုတိယဝါဆို
      assert.equal(myCal.md, 5); // ၅ 
    })
    it('should be identical to the value of mmcalendar 6', function(){
      var myCal = mccjs.g2m(2003, 7, 16); 
      assert.equal(myCal.my, 1365); // ၁၃၆၅
      assert.equal(myCal.mm, 4); // ဝါဆို
      assert.equal(myCal.md, 18); // ၃
    })
  })
})


describe('Homomorphic', function () {
  it('should always return to the same date', function() {
    var years = range(1980, 2015);
    var months = range(1, 13);
    var days = range(1, 29);

    for (y in years) {
      for (m in months) {
        for (d in days) {
          var myCal = mccjs.g2m(years[y], months[m], days[d]);
          var gregCal = mccjs.m2g(myCal.my, myCal.mm, myCal.mmt, myCal.ms, myCal.d);
          assert.equal(years[y], gregCal.y);
          assert.equal(months[m], gregCal.m);
          assert.equal(days[d], gregCal.d);
        }
      }
    }
  })
})