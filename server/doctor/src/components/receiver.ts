import adminReceiver from './Admin';
import patientsReceiver from './Patients';

const receiver = async () => {
    await adminReceiver();
    await patientsReceiver();
}

export default receiver