import sideBarConfig from "@/configs/SideBarConfig";
import styled from "@emotion/styled";
import Image from "next/image";
import React from "react";

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}

const StyledSidebarHeader = styled.div`
    height: 64px;
    min-height: 64px;
    display: flex;
    align-items: center;
    padding: 0 20px;

    > div {
        width: 100%;
        overflow: hidden;
    }
`;

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ children, ...rest }) => {
    return (
        <StyledSidebarHeader {...rest}>
            <div className="flex justify-center items-center">
                <Image
                    width={sideBarConfig.images.width}
                    height={sideBarConfig.images.width}
                    className="object-cover"
                    alt="Image"
                    src={sideBarConfig.images.logo}
                />
            </div>
        </StyledSidebarHeader>
    );
};
