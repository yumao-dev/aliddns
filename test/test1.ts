// import * as d from "../index";
// import { Logtype } from "../index";
// let log = d.LogHelper.create(Logtype.http);
// log
//   .write("test")
//   .catch((err) => {
//     console.dir(1);
//   })
//   .finally(() => {
//     console.log("over");
//   });

import assert from "assert";

// import { PMSHelper } from "../helper/pmshelper";

// ConfigHelper.Config()
//   .then((c) => {
//     console.log(c);
//   })
//   .catch(console.error)
//   .finally(() => {
//     console.log("over");
//   });

// PMSHelper.AllResource()(
//   {
//     state: { user: { userid: 1485 } },
//     headers: {
//       authorization:
//         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMTgxNjEyNTc2MjciLCJjb2RlIjoiMTAwMDIwMTkwNjEyMTYyNzQyMjRfNzc0NTM4MzI3IiwidXNlcmlkIjoxNDg1LCJ1c2VyZ3JvdXAiOlsiMCJdLCJuaWNrbmFtZSI6IuWRteWRtSIsImlzcyI6Im9hdXRoIiwic3ViIjoiMTgxNjEyNTc2MjciLCJhdWQiOiJ1c2VyLnl1bWFvLnRlY2giLCJqdGkiOiIxNDg1IiwiaWF0IjoxNjQ4NDQyMjkzLCJleHAiOjE2NDkwNDcwOTN9.aGefG880Poqo6nT2W-aPBOl31A_bKZSojatwhdd8gIU",
//     },
//   },
//   console.log
// )
//   .then((c) => {
//     console.log(c);
//   })
//   .catch((a) => {
//     console.error(a);
//   })
//   .finally(() => {
//     console.log("over");
//   });

function sum(...rest: number[]) {
  var sum = 0;
  for (var one of rest) {
    sum += one;
  }
  return sum;
}

describe("大的组1测试", () => {
  describe("小的组1测试", () => {
    it("sum() 0", () => {
      assert.strictEqual(sum(), 0); //测试用例
    });
  });
  describe("小的组2测试", () => {
    // it("sum(1) 1", () => {
    //   assert.strictEqual(sum(1), 2);
    // });
    it("sum(1,2) 3", () => {
      assert.strictEqual(sum(1, 2), 3);
    });
  });
});
describe("大的组2测试", () => {});
