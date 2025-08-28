import { Spin } from "antd";

const Loading = () => {
    return (
        <div className="flex justify-center mt-10">
            <Spin size="large" />
        </div>
    );
}

export default Loading;