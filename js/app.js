avalon.define("app",function(vm){
	vm.maxCount=5;
	vm.dataSource=[];
	vm.historyInputs=[];
	vm.matchItems=[];
	vm.summary="";
	vm.inputNum="";
	vm.selectedTab=0;
	vm.init=function(){
		vm.dataSource= generateDataSource();
	}
	vm.inputCheck=function(e){
		if(vm.inputNum.length>3){
			vm.inputNum= vm.inputNum.substring(0,3);
		}
		if(e.keyCode==13){
			vm.analysisResult();
		}
	}
	vm.analysisResult=function(){
		if(vm.inputNum=="") return;
		var inputNum= unique(vm.inputNum.split(""));
		vm.matchItems=[];
		for(var i=0;i< vm.dataSource.length;i++){
			var matchCount=0;
			for(var j=0;j<inputNum.length;j++){
				var source=vm.dataSource[i].item;
				matchCount += source.match(inputNum[j])?1:0;
			}
			if(matchCount<=1){
				vm.dataSource[i].count+=1;
			}
			if(matchCount>1){
				vm.dataSource[i].count=0
			}
			if(vm.dataSource[i].count>=5){
				vm.matchItems.push(vm.dataSource[i]);
			}
		}
		vm.historyInputs.push(vm.inputNum);
		vm.inputNum="";
	}
	vm.show=function(index){
		vm.selectedTab=index;
	}
});

avalon.scan();

avalon.vmodels.app.init();

function generateDataSource(){
	return searcher({source:[0,1,2,3,4,5,6,7,8,9], numLength:5});
}

function searcher(options){
	var dataSource=options.source;
	var numLength= options.numLength;
	var pTable=[];
	var output=[];
	for(var i=0;i< dataSource.length;i++){
		if(i<numLength){
			pTable.push(1);
		}
		else{
			pTable.push(0);
		}
	}

	var bFind = false;  
    do   
    {  
    	var outputItem=[];
        for (var i = 0; i < pTable.length; i++){  
            if(pTable[i]==1){
            	outputItem.push(dataSource[i]);
            }
        }  
        output.push({item:outputItem.join(""), count:0});
  
        bFind = false;  
        for(var i = 0; i < pTable.length-1; i++)  
        {  
            if(pTable[i]==1 && pTable[i+1]==0)  
            {  
                var result= swap(pTable[i],pTable[i+1]);    //调换10为01  
                pTable[i]= result.p1;
                pTable[i+1]= result.p2;
                bFind = true;  
  
                if(pTable[0] == 0)  //如果第一位为0，则将第i位置之前的1移到最左边，如为1则第i位置之前的1就在最左边，无需移动  
                {  
                    for (var k=0, j=0; k < i; k++)   //O(n)复杂度使1在前0在后  
                    {  
                        if(pTable[k]==1)  
                        {  
                            var res=swap(pTable[k],pTable[j]);  
                            pTable[k]= res.p1;
                			pTable[j]= res.p2;
                            j++;  
                        }  
                    }  
                }  
  
                break;  
            }  
        }  
    } while (bFind);  

    return output;
}

function swap(p1,p2){
	var a=p1, b=p2;
	b = b ^ a;
    a = a ^ b;
    b = b ^ a;
	return {p1:a, p2:b};
}

function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}