export class ReqRFAObj {
    RFAInfo: ReqRFAInfoObj;

    constructor() {
        this.RFAInfo = new ReqRFAInfoObj();
    }
}

export class ReqRFAInfoObj {
    SchemeCode : string;
    TaskId : number;
    RequestId : number;
    ExcludeType : Array<string>;
    ApprovalTypes : Array<ApprovalTypeObj>;
    Recommendations : Array<RecommendationObj>;
    RequestDate : Date;
    ListApvCode : Array<string>;
    OfficeCode : string;
    RequestBy : string;
    Notes : string;
    Reason : string;
    CategoryId : number;
    SchemeId : number;
    TrxNo : string;
    CategoryCode : string;
    Rfa : string;

    constructor() {
        this.SchemeCode = "";
        this.TaskId = 0;
        this.RequestId = 0;
        this.ExcludeType = new Array<string>();
        this.ApprovalTypes = new Array<ApprovalTypeObj>();
        this.Recommendations = new Array<RecommendationObj>();
        this.RequestDate = new Date();
        this.ListApvCode = new Array<string>();
        this.OfficeCode = "";
        this.RequestBy = "";
        this.Notes = "";
        this.Reason = "";
        this.CategoryId = 0;
        this.SchemeId = 0;
        this.TrxNo = "";
        this.CategoryCode = "";
        this.Rfa = "";
    }
}

export class ApprovalTypeObj {
    TypeId: number;
    isRoleAssignment: boolean;
    TypeCode: string;
    TypeName: string;
    Attributes: Array<AttributeObj>;
    Nodes: Array<NodeObj>;

    constructor() {
        this.TypeId = 0;
        this.isRoleAssignment = false;
        this.TypeCode = "";
        this.TypeName = "";
        this.Attributes = new Array<AttributeObj>();
        this.Nodes = new Array<NodeObj>();
    }
}

export class RecommendationObj {
    Questionid: number;
    QuestionName: string;
    QuestionResult: string;

    constructor() {
        this.Questionid = 0;
        this.QuestionName = "";
        this.QuestionResult = "";    
    }
}

export class AttributeObj {
    AttributeId: number;
    AttributeName: string;
    AttributeValue: string;
    DataType: string;

    constructor() {
        this.AttributeId = 0;
        this.AttributeName = "";
        this.AttributeValue = "";
        this.DataType = "";
    }
}

export class NodeObj {
    NodeId: number;
    slcMemberId: number;
    NodeName: string;
    Members: Array<MemberObj>;

    constructor() {
        this.NodeId = 0;
        this.slcMemberId = 0;
        this.NodeName = "";
        this.Members= new Array<MemberObj>();
    }
}

export class MemberObj {
    ApprovalTypeId: number;
    MemberId: number;
    Username: string;
    RoleCode: string;
    RoleName: string;

    constructor() {
        this.ApprovalTypeId = 0;
        this.MemberId = 0;
        this.Username = "";
        this.RoleCode = "";
        this.RoleName = "";
    }
}