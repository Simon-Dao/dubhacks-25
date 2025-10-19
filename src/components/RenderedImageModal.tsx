import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";

export default function RenderedImageModal({
    imageURL,
    open,
    onClose,
}: {
    imageURL: string;
    open: boolean;
    onClose: () => void;
}) {
    return (
        <div>
            <Dialog open={open} onClose={onClose} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden border border-gray-300 bg-gray-50 shadow-xl rounded-xl text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <div className="bg-gray-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <DialogTitle
                                            as="h3"
                                            className="text-[1.5rem] font-semibold text-center"
                                        >
                                            Outfit Viewer
                                        </DialogTitle>
                                        <div className="mt-2">
                                            <img
                                                src={imageURL}
                                                alt="Rendered Outfit"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 flex flex-row justify-around sm:px-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const a = document.createElement("a");
                                        a.download = "model.png";
                                        a.href = imageURL;
                                        a.click();
                                    }}
                                    className="inline-flex w-full justify-center rounded-md bg-blue-500 px-4 py-3 text-md font-semibold text-white hover:bg-blue-400 sm:ml-3 sm:w-auto"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onClose()}
                                    className="inline-flex w-full justify-center rounded-md bg-red-500 px-4 py-3 text-md font-semibold text-white hover:bg-red-400 sm:ml-3 sm:w-auto"
                                >
                                    Close
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
