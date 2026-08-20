import { Icon } from "@iconify/react";
import { Link, usePage } from "@inertiajs/react";

const Breadcrumb = ({ title, subtitle }) => {
    const { url } = usePage();
    return (
        // <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24'>
        //   <h6 className='fw-semibold mb-0'>{title}</h6>
        //   <ul className='d-flex align-items-center gap-2'>
        //     <li className='fw-medium'>
        //       <Link
        //         href={url}
        //         className='d-flex align-items-center gap-1 hover-text-primary'
        //       >
        //         <Icon
        //           icon='solar:home-smile-angle-outline'
        //           className='icon text-lg'
        //         />
        //         {subtitle}
        //       </Link>
        //     </li>
        //     {/* {subtitle && (
        //       <>
        //         <li> - </li>
        //         <li className='fw-medium'>{subtitle}</li>
        //       </>
        //     )} */}
        //   </ul>
        // </div>
        <div className="page-title-head d-flex align-items-center gap-2">
            <div className="flex-grow-1">
                <h4 className="fs-18 fw-bold mb-0">{title}</h4>
            </div>
            <div className="text-end">
                <ol className="breadcrumb m-0 py-0 fs-13">
                    <li className="breadcrumb-item">
                        <Link href="">{title}</Link>
                    </li>
                    {subtitle && (
                        <>
                            <div className="mx-1 flex-centered">
                                <Icon
                                    style={{ marginTop: 3.9 }}
                                    icon="tabler:chevron-right"
                                    height={12}
                                    width={12}
                                />
                            </div>
                            <li className="breadcrumb-item">
                                <Link href="">{subtitle}</Link>
                            </li>
                        </>
                    )}
                </ol>
            </div>
        </div>
    );
};

export default Breadcrumb;
