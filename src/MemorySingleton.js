export class Memory
{
    static instance;
    User="";
    Level=0;
    Impersonate = false;

    constructor(){
        if(Memory.instance){
            return Memory.instance;
        }

        Memory.instance=this;
    }
}
