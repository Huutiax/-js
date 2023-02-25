
const PROMISE_PENDING = "pending"
const PROMISE_RESOLVED = "resolved"
const PROMISE_REJECTDE = "rejected"

class HTPromise {
    constructor(executor) {
        this.status = PROMISE_PENDING
        this.value = undefined
        this.reason = undefined
        this.onResolvedFns = []
        this.onRejectdeFns = []

        const resolve = (value) => {
            if(this.status === PROMISE_PENDING) {
                queueMicrotask(() => {
                    if(this.status !== PROMISE_PENDING) return
                    this.status = PROMISE_RESOLVED
                    this.value = value
                    this.onResolvedFns.forEach(fn => {
                        fn(this.value)
                    })
                });

            }
        }

        const reject = (reason) => {
            if(this.status === PROMISE_PENDING) {
                queueMicrotask(() => {
                    if(this.status !== PROMISE_PENDING) return
                    this.status = PROMISE_REJECTDE
                    this.reason = reason
                    this.onRejectdeFns.forEach(fn => {
                        fn(this.reason)
                    })
                })

            }
        }

        executor(resolve,reject)

    }
    then(onResolved,onRejected) {
        if(this.status === PROMISE_RESOLVED && onResolved) {
            onResolved(this.value)
        }
        if(this.status === PROMISE_REJECTDE && onRejected) {
            onRejected(this.reason)
        }
        if(this.status === PROMISE_PENDING) {
            this.onResolvedFns.push(onResolved)
            this.onRejectdeFns.push(onRejected)
        }

    }
}

const promise = new HTPromise((resolve, reject) => {
    console.log("状态pending")
    resolve(1111) // resolved/fulfilled
    reject(2222)
  })

promise.then(res => {
    console.log("res1:", res)
  }, err => {
    console.log("err1:", err)
  })
  
  promise.then(res => {
    console.log("res2:", res)
  }, err => {
    console.log("err2:", err)
  })

  setTimeout(() => {
    promise.then(res => {
        console.log("res3:", res)
      }, err => {
        console.log("err3:", err)
      })
  },3000)

