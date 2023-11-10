import { PayloadAction, createSlice } from "@reduxjs/toolkit"

type initialState = {
    message: string,
    modalOpen: boolean,
    image: '',
    modalType: 'cart' | 'wishlist',
    modal: boolean,
    requestModal: boolean,
    addAdminModal: boolean,
    addRatingModal: boolean,
    deleteModal: boolean,
    isUpdating: boolean,
    productId: string,
    type: boolean,
    termModal: boolean,
    sellerPayoutModal: boolean,
    sellerWithdrawModal: boolean,
    cookieModal:boolean,
    languageModal:boolean,
    buyerProtectionModal: boolean,
    paypalModal: boolean,
}
const initialState : initialState = {
    modalOpen: false,
    message: '',
    image: '',
    modalType: 'cart',
    addAdminModal: false,
    modal: false,
    requestModal: false,
    deleteModal: false,
    addRatingModal: false,
    productId: '',
    type: false,
    isUpdating: false,
    termModal: false,
    sellerPayoutModal: false,
    sellerWithdrawModal: false,
    cookieModal:false,
    languageModal:false,
    buyerProtectionModal: false,
    paypalModal: false,
}
interface IMutate {
    id: string
}
const modal = createSlice({
    initialState,
    name: 'modal',
    reducers: {
        modalUserOpen(state: initialState, action: any){
            state.modalOpen = true;
            state.message = action.payload.message
            state.image = action.payload.image
            state.modalType = action.payload.modalType
        },
        editModal(state: initialState){
            state.modal = true;
        },
        requestModalOpen(state: initialState){
            state.requestModal = true
        },

        requestModalClose(state: initialState){
            state.requestModal = false
        },
        deleteModalOpen(state: initialState, action){
            state.deleteModal = true;
            state.productId = action.payload.id
            state.type = action.payload.type
        },
        deleteModalClose(state: initialState){
            state.deleteModal = false
        },
        addAdminModalOpen(state: initialState, action){
            state.addAdminModal = true
            state.productId = action.payload.id
        },
        addAdminModalClose(state: initialState){
            state.addAdminModal = false
        },
        addRatingModalOpen(state: initialState){
            state.addRatingModal = true
        },
        updateModal (state: initialState) {
            state.isUpdating = !state.isUpdating
        },
        addRatingModalClose(state: initialState){
            state.addRatingModal = false
        },
        modalClose(state:  initialState){
            state.modalOpen = false;
        },
        addProductId(state : initialState, action: any) {
          state.productId = action.payload.id
        },
        handleCloseModal(state:  initialState){
            state.modal = false;
        },
        openTermModal(state: initialState) {
            state.termModal = true
        },
        closeTermModal(state: initialState) {
            state.termModal = false
        },
        openSellerPayoutModal(state: initialState, action: PayloadAction<boolean>) {
            state.sellerPayoutModal = action.payload
        },
        closeSellerPayoutModal(state: initialState, action: PayloadAction<boolean>) {
            state.sellerPayoutModal = action.payload
        },
        setModalCookie(state: initialState, action: PayloadAction<boolean>) {
          state.cookieModal = action.payload;
        },
        setLanguageModal(state: initialState, action: PayloadAction<boolean>) {
            state.languageModal = action.payload;
        },
        openCloseSellerWithdrawModal(state: initialState, action: PayloadAction<boolean>) {
            state.sellerWithdrawModal = action.payload;
        },
        openCloseBuyerProtectionModal(state: initialState, action: PayloadAction<boolean>) {
            state.buyerProtectionModal = action.payload;
        },
        openClosePaypalModal(state: initialState, action: PayloadAction<boolean>) {
            state.paypalModal = action.payload;
        }
    }
})
export const { 
    setLanguageModal,
    setModalCookie,
    closeSellerPayoutModal, 
    openSellerPayoutModal, 
    modalUserOpen, 
    updateModal, 
    addProductId, 
    modalClose, 
    editModal, 
    deleteModalOpen, 
    deleteModalClose, 
    addRatingModalOpen, 
    addRatingModalClose, 
    handleCloseModal, 
    addAdminModalOpen,
    addAdminModalClose, 
    requestModalOpen, 
    requestModalClose , 
    openTermModal, 
    closeTermModal,
    openCloseSellerWithdrawModal,
    openCloseBuyerProtectionModal,
    openClosePaypalModal,
} = modal.actions;
export default modal.reducer;
