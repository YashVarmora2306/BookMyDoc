import adminReceiver from "./Admin"
import doctorReceiver from "./Doctor"

const receiver = async () => {
    await adminReceiver();
    await doctorReceiver(); 
}

export default receiver