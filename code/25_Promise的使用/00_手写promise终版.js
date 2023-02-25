class mayPromise {
    status = null
    _value = null
    PENDING = '待定'
    FULFILLED = '成功'
    REJECTED = '失败'

    constructor(fn) {
        // 实例化的时候创建数组保存对应的 函数
        this.resolveCallBack = []
        this.rejectCallBack = []

        this.status = this.PENDING
        // 在 Promise 内部可能会抛出错误 所以要使用 try catch 在构造函数中捕获
        try {
            // 初始化 new Promise 的时候直接调用
            // 调用的时候 一定要 bind 构造函数的 this
            // 传入的参数必须是一个函数 才能去调用
            typeof fn === 'function' && fn(this.resolve.bind(this), this.reject.bind(this))
        } catch (err) {
            this.reject(err)
        }
    }

    resolve(value) {
        // resolve 是必须要在时间轮询之后才能调用，所以使用 settimeout 包裹
        setTimeout(() => {
            // 如果状态是 待定直接 修改状态 为 成功
            if (this.status === this.PENDING) {
                this.status = this.FULFILLED
                this._value = value
                // 循环调用存储的函数
                this.resolveCallBack.forEach(fn => fn(value))
            }
        }, 0)
    }

    reject(error) {
        // reject 是必须要在时间轮询之后才能调用，所以使用 settimeout 包裹
        setTimeout(() => {
            // 如果状态是 待定直接 修改状态 为 失败
            if (this.status === this.PENDING) {
                this.status = this.REJECTED
                this._value = error
                // 循环调用存储的函数
                this.rejectCallBack.forEach(fn => fn(error))
            }
        }, 0)
    }

    then(onFulfilled, onRejected) {
        return new mayPromise((resolve, reject) => {
            // 先判断 传入的 参数 是不是一个函数，不是参数 默认设置为一个空函数
            onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : () => {}
            onRejected = typeof onRejected === 'function' ? onRejected : () => {}
            //	如果状态是 待定
            if (this.status === this.PENDING) {
                this.resolveCallBack = [...this.resolveCallBack, onFulfilled]
                this.rejectCallBack = [...this.rejectCallBack, onRejected]
                // 将 resolve 和 reject 存储起来
                // 方便后续无限调用
                if (resolve) {
                    this.resolveCallBack = [...this.resolveCallBack, resolve]
                }
                if (resolve) {
                    this.resolveCallBack = [...this.resolveCallBack, resolve]
                }
            }

            // 如果状态是 成功 就调用 onFulfilled
            if (this.status === this.FULFILLED) {
                // 实现 resolve 函数的 then 函数
                setTimeout(() => {
                    onFulfilled(this._value)
                }, 0)
            }

            // 如果状态是 失败 就调用 onRejected
            if (this.status === this.REJECTED) {
                //	实现 reject 函数的 then 函数
                setTimeout(() => {
                    onRejected(this._value)
                }, 0)
            }
        })
    }
}

console.log('第一步')
new mayPromise((resolve, reject) => {
    console.log('第二步')
    setTimeout(() => {
        resolve('成功 - resolve')
        resolve('失败 - reject')
        console.log('第四步')
    }, 0);
}).then(
    res => {
        console.log(res)
    },
    error => {
        console.log(error.message)
    }
).then(res => {
    console.log(res, 'then - 2')
}).then(res => {
    console.log(res, 'then - 3')
}).then(res => {
    console.log(res, 'then - 4')
})
console.log('第三步')

