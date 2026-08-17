import { t } from 'i18next';
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import "animate.css";

const basicAlert = (title, text, icon) => {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'OK',
        customClass: {
            popup: 'swal-popup',
            title: 'swal-title',
            content: 'swal-content',
            confirmButton: 'swal-confirm-button'
        },
        buttonsStyling: false
    });
}

const confirmAlert = (title, text, icon, onConfirm) => {
    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonText: t('Yes'),
        cancelButtonText: t('No'),
        cancelButtonColor: ' #dc3545',
        confirmButtonColor: '#3085d6',
        showClass: {
            popup: `
                    animate__animated
                    animate__zoomIn
                    animate__faster
                    `
        },
        hideClass: {
            popup: `
                    animate__animated
                    animate__zoomOut
                    animate__faster
                   `
        }
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm();
        }
    });
}
const confirmAlertWithHtml = (title,text,html,icon,onConfirm,preConfirm = null) => {
    return Swal.fire({
        title,
        text,
        html,
        icon,
        showCancelButton: true,
        confirmButtonText: t("Yes"),
        cancelButtonText: t("No"),
        cancelButtonColor: "#dc3545",
        confirmButtonColor: "#3085d6",
        showClass: {
            popup: `
                animate__animated
                animate__zoomIn
                animate__faster
            `,
        },
        hideClass: {
            popup: `
                animate__animated
                animate__zoomOut
                animate__faster
            `,
        },
        preConfirm,
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm(result.value);
        }
    });
};
export { basicAlert, confirmAlert, confirmAlertWithHtml };
