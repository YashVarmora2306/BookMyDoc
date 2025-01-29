import adminReceiver from "./Admin"
import doctorReceiver from "./Doctor"
import userReceiver from "./User"

const receiver = async () => {
    await adminReceiver();
    await doctorReceiver(); 
    await userReceiver();
}

export default receiver