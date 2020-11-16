import React from "react";
import {useToasts} from "react-toast-notifications";


function Toasty (props)
{
    const {addToast} = useToasts();

    addToast(props.msg, props.etc);
}

export default Toasty;
