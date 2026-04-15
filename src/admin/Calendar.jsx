import React from 'react';
import { Breadcrumb } from './components/Breadcrumb';

const Calendar = () => {
    return (
        <>
            <Breadcrumb pageName="Calendar" />

            <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <table className="w-full">
                    <thead>
                        <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white">
                            <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
                                Sun
                            </th>
                            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                                Mon
                            </th>
                            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                                Tue
                            </th>
                            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                                Wed
                            </th>
                            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                                Thu
                            </th>
                            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
                                Fri
                            </th>
                            <th className="flex h-15 items-center justify-center rounded-tr-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
                                Sat
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="grid grid-cols-7">
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                                <span className="font-medium text-black dark:text-white">1</span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                                <span className="font-medium text-black dark:text-white">2</span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                                <span className="font-medium text-black dark:text-white">3</span>
                                <div className="group h-16 w-full flex-grow cursor-pointer py-1 md:h-30">
                                    <span className="group-hover:text-primary md:hidden">More..</span>
                                    <div className="event invisible absolute left-2 z-99 mb-1 flex w-[200%] flex-col rounded-sm border-l-[3px] border-primary bg-gray px-3 py-1 text-left opacity-0 group-hover:visible group-hover:opacity-100 dark:bg-meta-4 md:visible md:w-[190%] md:opacity-100">
                                        <span className="event-name text-sm font-semibold text-black dark:text-white">
                                            Flight AA-102
                                        </span>
                                        <span className="time text-xs font-medium text-black dark:text-white">
                                            12:00 PM - 1:00 PM
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                                <span className="font-medium text-black dark:text-white">4</span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                                <span className="font-medium text-black dark:text-white">5</span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                                <span className="font-medium text-black dark:text-white">6</span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                                <span className="font-medium text-black dark:text-white">7</span>
                            </td>
                        </tr>
                        {/* Row 2 */}
                        <tr className="grid grid-cols-7">
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                                <span className="font-medium text-black dark:text-white">8</span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                                <span className="font-medium text-black dark:text-white">9</span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                                <span className="font-medium text-black dark:text-white">10</span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                                <span className="font-medium text-black dark:text-white">11</span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                                <span className="font-medium text-black dark:text-white">12</span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                                <span className="font-medium text-black dark:text-white">13</span>
                            </td>
                            <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                                <span className="font-medium text-black dark:text-white">14</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Calendar;
