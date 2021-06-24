import { AppCustAddrObj } from "./AppCustAddrObj.Model";

export class DocPickupRequestObj {
    AppNo: string;
    OfficeName: string;
    CustNo: string;
    CustName: string;
    CustId: number;
    RequestDate: Date;
    RequestBy: string;
    Username: string;
    OfficeCode: string;
    OfficeId: number;
    SrvyTaskId: number;    
    SrvyOrderId: number;      
    SrvyTaskNo: string;  
    MrSurveyTypeCode: string;     
    MrSurveyTaskStatCode: string;      
    MrSrvyObjTypeCode: string;      
    RefNo: string;     
    SurveyorId: number;     
    RetrieveDt: Date;     
    ResultDt: Date;       
    ReviewByRefUserId: number;        
    ReviewDt: Date;        
    ReviewNotes: string;    
    IsAddtReq: number;        
    PrevSurveyTaskNo: string;    
    Result: any;      
    MrCustModelCode: string;      
    CustAddr: string;       
    CustPhone: string;      
    Zipcode: string;    
    AssignDt: Date;         
    SrvyFormSchmId: number;       
    Notes: string;        
    RefReasonId: number;       
    PrevSurveyorId: number;      
    MobileAssignmentId: number;        
    Kelurahan: string;       
    Kecamatan: string;      
    RT: string;       
    RW: string;       
    City: string;        
    Addr: string; 
    AppCustAddrObjs: Array<AppCustAddrObj>;
    
    
    
}