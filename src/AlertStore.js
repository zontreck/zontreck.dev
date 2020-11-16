class AlertStore {
    static inst = null;
    _alerts = [];

    
  static instance(){
      if(AlertStore.inst == null){
          AlertStore.inst=new AlertStore();
      }
      return this.inst;
  }

  add(item){
      this._alerts.push(item);
  }

  get(id){
      return this._alerts.find(d=> d===id);
  }
}

export default AlertStore;
