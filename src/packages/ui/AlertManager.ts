import { toast, ToastOptions, Slide } from "react-toastify";
import { defaults } from "lodash";

export type AlertType = 'success' | 'info' | 'warning' | 'error';

class AlertManager {
    private defaults:ToastOptions = {
        position: 'top-right',
        hideProgressBar: true,
        autoClose: 2000,
        closeOnClick: true,
        className: 'alert-info',
        transition: Slide,
        draggable: false,
        type: 'info'
    }

    alert(message: string, type: AlertType) {
        const options = defaults({ type }, this.defaults);
        toast(message, options);
    }
}

export const alertManager = new AlertManager();