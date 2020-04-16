///budget controller

var budgetController=(function(){

    var Expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };
    Expense.prototype.calcPercentage=function(totalInc){
       if(totalInc>0){ 
         this.percentage=Math.round((this.value/totalInc)*100);
       }else{
        this.percentage=-1;
    }
  
  };
  Expense.prototype.getPercentage=function(){
    return this.percentage;
  }


    var Income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
   
    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(curr){
         sum=sum+curr.value;
        });
        data.totals[type]=sum;
    };

   var data={
       allItems:{
           exp:[],
           inc:[]
       },
       totals:{
           exp:0,
           inc:0
       },
     budget:0,
     percentage:-1
   };

   return {
       addItem:function(type,des,val){
           var newItem,ID;
            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1
           //create new id
           if (data.allItems[type].length > 0) {
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        } else {
            ID = 0;
        }
        
             //create new item
             if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
           //push into data structute
           data.allItems[type].push(newItem);
           //return the new element
           return newItem;
       },

        deleteItem:function(type,id){
            //ids=[1 2 4 5 8]
            //index=3,id=5
           var ids= data.allItems[type].map(function(current){
              return current.id;
            });
           var index=ids.indexOf(id);
           if(index!==-1){
             data.allItems[type].splice(index,1);
           }
        },      
  
        calculateBudget:function(){
          //calculate total incoem aand expenses
        calculateTotal('exp');
        calculateTotal('inc');

          //calculate the budget:income -expense
         data.budget=(data.totals.inc-data.totals.exp);

        //  calculate thhe percentage of incomr that we spent
        if(data.totals.inc>0){
            data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
        }else{
            data.percentage=-1;
        }
           },

     calculatePercentages:function(){
      data.allItems.exp.forEach(function(curr){
       curr.calcPercentage(data.totals.inc);
      });

     },  
     getPercentages:function(){
       var allPerc=data.allItems.exp.map(function(curr){
          return curr.getPercentage();
       });
     return allPerc;
     }, 

     getBudget:function(){
         return{
             budget:data.budget,
             totalInc:data.totals.inc,
             totalExp:data.totals.exp,
             percentage:data.percentage

         };
     },

       testing:function(){
           console.log(data);
       }
   };

})();



//ui controller
var UIController=(function(){

    var DOMStrings={
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
        expensesPercLabel:'.item__percentage',
        dateLabel:'.budget__title--month'
    };
   
    return {
      getinput:function(){  
        return{
        type:document.querySelector(DOMStrings.inputType).value, //inc or exp
        description:document.querySelector(DOMStrings.inputDescription).value,
        value:parseFloat(document.querySelector(DOMStrings.inputValue).value)
        }; 
      },
      addListItem:function(obj,type){
          var html,newHTML,element;
          //create html string with place holder
          if(type==='inc'){
              element=DOMStrings.incomeContainer;
            html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix">'+
            '<div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline">'+
            '</i></button></div>'+
            '</div></div>';
          }else{
              element=DOMStrings.expensesContainer;
            html='<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix">'+
            '<div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete">'+
                '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div> ';
        
          }
             //replace the place holder with some actual data
             newHTML=html.replace('%id%',obj.id);
             newHTML=newHTML.replace('%description%',obj.description);
             newHTML=newHTML.replace('%value%',obj.value);

          //insert the html into the dom
            document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);


      },
      deleteListItem:function(selectorID){
          var el=document.getElementById(selectorID);
          el.parentNode.removeChild(el);


      },


      clearFields:function(){
          var fields;
       fields=document.querySelectorAll(DOMStrings.inputDescription+','+DOMStrings.inputValue);
        var fieldsArr=Array.prototype.slice.call(fields);
        fieldsArr.forEach(function(current,index,array){
         current.value="";
            
        });
        fieldsArr[0].focus();
      
      },
      displayBudget:function(obj){
    document.querySelector(DOMStrings.budgetLabel).textContent=obj.budget;
    document.querySelector(DOMStrings.incomeLabel).textContent=obj.totalInc;
    document.querySelector(DOMStrings.expensesLabel).textContent=obj.totalExp;
     if(obj.percentage>0){
        document.querySelector(DOMStrings.percentageLabel).textContent=obj.percentage+'%';

      }else{
        document.querySelector(DOMStrings.percentageLabel).textContent='--';
    
      }
      
},     
  
 
   displayPercentages:function(percentages){
    var fields=document.querySelectorAll(DOMStrings.expensesPercLabel);
     
    var nodeListForEach=function(list,callback){
         for(var i=0;i<list.length;i++){
           callback(list[i],i);
         }
    };
    nodeListForEach(fields,function(current,index){
      if(percentages[index]>0){
        current.textContent=percentages[index]+'%';
      }else{
        current.textContent='--';
      }
        
    });

   },

   displayMonth:function(){
  var months=['january','february','march','april','may'];
   var now=new Date();
   var year=now.getFullYear();
   var month=now.getMonth();
   document.querySelector(DOMStrings.dateLabel).textContent=months[month]+' '+year;
   

   } ,

    getDOMstrings:function(){
        return DOMStrings;
    }
      
    };
})();

//global app controller
var controller=(function(budgetCtrl,UICtrl){

    var setupEventListeners=function(){

        var DOM=UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function(event){
            //keycode for enter is 13
            if(event.keyCode===13 ){
                ctrlAddItem();
            }
           
        });
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    };

    var updateBudget=function(){
        //calculate the budget
         budgetCtrl.calculateBudget();

        //return the budge
        var budget=budgetCtrl.getBudget();

      //display budget
      UICtrl.displayBudget(budget);
    };


    var updatePercentages=function(){
         //calculate percentage
         budgetController.calculatePercentages();
         //read percentage from tthe budget controller
         var percentages=budgetCtrl.getPercentages();
         //update the ui with new percentages
         UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem=function(){
        var newItem,input;
    
         //get the field input data
        input=UICtrl.getinput();
    
        if(input.description!=="" && !isNaN(input.value) && input.value>0){
     // add the item to the nudget controller
       newItem= budgetCtrl.addItem(input.type,input.description,input.value);

      //add item to the user nterface
      UICtrl.addListItem(newItem,input.type);

      //clear fields
     UICtrl.clearFields();
      //calculate and update budget
       updateBudget();
       //calculate and update percentages
        updatePercentages();
       }
     
};

   var ctrlDeleteItem=function(event){
       var itemID,splitID,type,ID;
     itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
     if(itemID){
       splitID=itemID.split('-');
       type=splitID[0];
       ID=parseInt(splitID[1]);
       //1.delete the item
        budgetCtrl.deleteItem(type,ID);
       //2. dlete the item from ui
       UICtrl.deleteListItem(itemID);
       //3.update and shpw the new budget
       updateBudget();
       //calculate and update percentages
       updatePercentages();
     }
   };


  return{
      init:function(){
          console.log('aaplication has started');
          UICtrl.displayMonth();
          setupEventListeners();
          UICtrl.displayBudget({
            budget:0,
            totalInc:0,
            totalExp:0,
            percentage:-1
        });
      }
  }

})(budgetController,UIController);


controller.init();