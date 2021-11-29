const main=document.querySelector('.main');
const footer=document.querySelector('.footer');
const welcomeMsg=document.querySelector('.nav__detail');
const balanceDom=document.querySelector('.balance__value');

const loginBtn=document.querySelector('.login__btn');
const loginUser=document.querySelector('.login__user');
const loginPin=document.querySelector('.login__pin');

const bank__transactions__container=document.querySelector('.bank__transactions');
const transferFormBtn=document.querySelector('.bank__operation-form__btn-transfer');
const transferRecipient=document.querySelector('.bank__operation-form__input-transfer--recipient');
const transferAmount=document.querySelector('.bank__operation-form__input-transfer--amount');

const loanFormBtn=document.querySelector('.bank__operation-form__btn-loan');
const loanAmount=document.querySelector('.bank__operation-form__input-loan--amount');

const bankIn=document.querySelector('.bank__transaction__info__in');
const bankOut=document.querySelector('.bank__transaction__info__out');

const closeFormBtn=document.querySelector('.bank__operation-form__btn-close');
const closeUser=document.querySelector('.bank__operation-form-close--user');
const closePin=document.querySelector('.bank__operation-form-close--pin');

class App{
    #accounts=[{owner: 'Jonas Schmedtmann',
                movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
                interestRate :1.2, 
                pin: 1111,
                balance:0,
                in:0,
                out:0 },

                {owner: 'Jessica Davis',
                movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
                interestRate :1.5, 
                pin:  2222,
                balance:0,
                in:0,
                out:0 }, 
            
                {owner: 'Steven Thomas Williams',
                movements: [200, -200, 340, -300, -20, 50, 400, -460],
                interestRate :1.3, 
                pin:  3333,
                balance:0,
                in:0,
                out:0},
            
                {owner: 'Sarah Smith',
                movements: [430, 1000, 700, 50, 90],
                interestRate :1, 
                pin:  4444,
                balance:0,
                in:0,
                out:0 }];

    #currentUser;
    #id;
    
    constructor(){
        //this._setLocalStorage();
        this._getLocalStorage();
        this._createUsername();
        loginBtn.addEventListener('click',this._checkLoginInfo.bind(this));

        transferFormBtn.addEventListener('click',this._transferAmount.bind(this));
        loanFormBtn.addEventListener('click',this._requestLoan.bind(this));
        closeFormBtn.addEventListener('click',this._closeAccount.bind(this));
    }

    _createUsername(){
        this.#accounts.forEach(function(ac){
            ac.userName=ac.owner
            .split(' ')
            .map(function(a){
                return a[0]     
            })
            .join('')
            .toLowerCase();
            //console.log(ac.userName);
        });
    }

    _checkLoginInfo(e){
        e.preventDefault();
        let user,pin;
        //Get values from fields
        user=loginUser.value;
        pin=+loginPin.value;

        this.#accounts.forEach(function(acc){
            if(this._checkUsername(user,acc.userName) && this._checkPin(pin,acc.pin)){
                this._getLocalStorage();
                //if(this.#id)clearTimeout(this.#id);
                //this.#id=setTimeout(this._logOut,5000);
                bank__transactions__container.innerHTML='';
                this.#currentUser=acc;
                this._clearFields(loginUser,loginPin);
                //balanceDom.textContent=this.#balance;
                this.#currentUser.balance=0;
                this.#currentUser.in=0;
                this.#currentUser.out=0;
                this._calculateBalance(this.#currentUser);
                this._displayBalance(this.#currentUser);
                this._displayBank();
                this._calcTotalDeposit(this.#currentUser);
                this._calcTotalWithdraw(this.#currentUser);
                this._displayWelcomeMsg();
                this.#currentUser.movements.forEach(this._displayMovements.bind(this));
            }
        }.bind(this));
    }

    _clearFields(field1,field2){
        field1.value='';
        if(field2){
            field2.value='';
        }
        return true;
    }

    _checkUsername(user,accUserName){
        return user===accUserName;
    }

    _checkPin(userPin,pin){
        return userPin===pin;
    }

    _calculateBalance(acc){
        acc.movements.forEach(function(movement){
            acc.balance=acc.balance+movement}.bind(this));
    }

    _updateBalance(amount){
       this.#currentUser.balance+=amount;
    }

    _displayBalance(acc){
        balanceDom.textContent=`$ ${acc.balance}`;
    }

    _displayBank(){
        main.classList.remove('hidden');
        footer.classList.remove('hidden');
    }

    _hideBank(){
        main.classList.add('hidden');
        footer.classList.add('hidden');
    }

    _displayWelcomeMsg(){
        if(this.#currentUser) welcomeMsg.textContent=`Welcome ${this.#currentUser.owner}`;
        else{
            welcomeMsg.textContent=`Log in to get started`;
        }
    }

    _displayMovements(movement,index){
        let type=movement>0?'deposit':'withdrawal';

        let html=` 
        <div class="bank__transaction--row">
            <div class="bank__transaction--row--action bank__transaction--row--action--${type}">
                <span class="bank__transaction--row--action--count">${index+1}</span>
                ${type.toUpperCase()}
            </div>
            <div class="bank__transaction--row--amount">
                $${movement}
            </div>
        </div>    `;

        bank__transactions__container.insertAdjacentHTML('afterbegin',html);

    }

    _transferAmount(e){
        e.preventDefault();
       let recipient=transferRecipient.value;
       let amount=+(transferAmount.value);

       if(recipient===this.#currentUser.userName )return;

       //If valid is input clear fields and update movement. No reason for && after clear fields but just to call _updateMovements.For this to work explicitly return true from clear fields
       this._objExists(recipient) && this._validateInputs(amount) && this._clearFields(transferRecipient,transferAmount) && this._updateMovements(amount,'-',recipient);

    }

    _requestLoan(e){
        e.preventDefault();
        let amount=+(loanAmount.value);

        //If valid is input clear fields and update movement. No reason for && after clear fields but just to call _updateMovements.For this to work explicitly return true from clear fields
        this._validateInputs(amount) && this._clearFields(loanAmount) && this._updateMovements(amount,'+');    
    }

    _objExists(uName){
        if(this.#accounts.some(function(acc){
            return acc.userName===uName;
        }.bind(this)))return true;
    }

    _validateInputs(amount){
        return Number.isFinite(amount) && amount!=null;
    }

    _updateMovements(amount,sign,recipient=''){
       //Update user movement array
       this.#currentUser.movements.push(+(sign+amount));

       //Update user movement UI
       this._displayMovements(+(sign+amount),this.#currentUser.movements.length-1);

       //Update user balance
       this.#currentUser.movements[this.#currentUser.movements.length-1];
       this._updateBalance(this.#currentUser.movements[this.#currentUser.movements.length-1]);

       //Display user balance
       this._displayBalance(this.#currentUser);

       sign=='+' ? this._updateDeposit(amount):this._updateWithdraws(amount);


       //Update recipient movements
       if(recipient!='')this._updateRecipientMovements(recipient,amount);

       console.log('B4 setting local storage'+this.#accounts);
    
       this._setLocalStorage();
    }

    _updateRecipientMovements(recipient,amount){
        this.#accounts.forEach(function(acc){
            this._checkUsername(recipient,acc.userName) && acc.movements.push(amount) && this._calculateBalance(acc);
        }.bind(this));
    }

    _calcTotalDeposit(acc){
        //console.log(acc.in);
        acc.movements.forEach(function(move){
            if(move>0) acc.in+=move;
        }.bind(this));
        //console.log(acc.in);
        bankIn.textContent=acc.in;
    }

    _calcTotalWithdraw(acc){
        //console.log(acc.out);
        acc.movements.forEach(function(move){
            if(move<0) acc.out+=move;
        }.bind(this));
        //console.log(acc.out);
        bankOut.textContent=acc.out;
    }

    _updateDeposit(amount){
        this.#currentUser.in+=amount;
        bankIn.textContent=this.#currentUser.in;
    }

    _updateWithdraws(amount){
        this.#currentUser.out+=amount;
        bankOut.textContent=this.#currentUser.out;
    }

    _closeAccount(e){
        e.preventDefault();

        let user=closeUser.value;
        let pin=+closePin.value;

        this._checkUsername(this.#currentUser.userName,user) && this._checkPin(this.#currentUser.pin,pin) && this._deleteUser() && this._clearFields() && this._logOut() && this._setLocalStorage();
    }

    _deleteUser(){
        this.#accounts.splice(this.#accounts.indexOf(this.#currentUser),1);
        return true;
    }

    _logOut(){
        this.#currentUser=null;
        this._hideBank();
        this._displayWelcomeMsg();
        return true;
    }

    _setLocalStorage(){
        localStorage.setItem('accounts',JSON.stringify(this.#accounts));
    }

    _getLocalStorage(){
        const data=JSON.parse(localStorage.getItem('accounts'));
        
        if(!data) return;

        this.#accounts=data;

        console.log(this.#accounts);

       /* this.#accounts.forEach(function(acc){
            if(acc.movements.some((m)=>!Number.isFinite(m) || m==null)){
                acc.movements=acc.movements.filter(function(move){
                  return Number.isFinite(move) && move!=null
                })
            }
        });
         */ 
    }
}

const app=new App();
