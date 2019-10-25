import {StackProps} from "@aws-cdk/core";

export interface IWorkshopStackProps extends StackProps {
    credentials: {
        cwb_token: string
    }
}
