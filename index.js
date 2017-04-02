let navControl = {
    position: 0,
    navArray: [],
    actionArray: [],
    dataArray: [],
    countArray: [],
    boxNaneArray: [],
    enter: '',
    out: '',
    startBox: '',
    endBox: '',
    //预配置
    config: function (boxNane, obj) {
        this.boxNaneArray.push(boxNane);
        this.actionArray[boxNane] = obj;
        this.dataArray[boxNane] = {};
        this.countArray[boxNane] = 0;
        return this;
    },
    //初始化
    start: function () {
        //动态流程
        if (this.navArray.length) {
            this.startBox = this.navArray[0][1];
        }
        //静态流程
        else {
            for (var k in this.boxNaneArray) {
                this.navArray.push([k, this.boxNaneArray[k]]);
            }
            this.startBox = this.boxNaneArray[0];
        }
        for (var i in this.dataArray) {
            this.endBox = i;
        }
        $('#' + this.startBox).show();
        this.actionArray[this.startBox] && this.actionArray[this.startBox].beforeIn && this.actionArray[this.startBox].beforeIn();
    },
    //流程配置，只有一个流程时不用配置
    setNav: function (navArray) {
        this.navArray = navArray;
        this.position = 0;
    },
    next: function () {
        this.position = this.position < 0 ? 0 : this.position;
        this.out = this.navArray[this.position][1];
        var outAction = this.actionArray[this.out];
        if (outAction) {
            if (!outAction.beforeOut || outAction.beforeOut(this.dataArray[this.out] = {}) !== false) {
                this.enter = this.navArray[this.position + 1][1];
                var enterAction = this.actionArray[this.enter];
                if (enterAction) {
                    if (enterAction.beforeIn) {
                        if (this.enter === this.endBox) {
                            var submitData = {};
                            for (var i in this.dataArray) {
                                var dataObj = this.dataArray[i];
                                for (var n in dataObj) {
                                    submitData[n] = dataObj[n];
                                }
                            }
                            enterAction.beforeIn(submitData);
                        } else {
                            this.position++;
                            progressBar.next();
                            enterAction.beforeIn(this.countArray[this.enter]++);
                        }
                    } else {
                        this.position++;
                        progressBar.next();
                    }
                }
            }
        }
    },
    prev: function () {
        this.position = this.position < 0 ? 0 : this.position;
        this.out = this.navArray[this.position][1];
        this.dataArray[this.out] = {};
        if (this.actionArray[this.out] && this.actionArray[this.out].afterOut) {
            this.actionArray[this.out].afterOut();
        }
        this.enter = this.navArray[this.position - 1][1];
        if (this.actionArray[this.enter] && this.actionArray[this.enter].afterIn) {
            this.actionArray[this.enter].afterIn();
        }
        this.position--;
        progressBar.prev();
    }
};
