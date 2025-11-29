import tick from '../assets/tick.svg'
import cross from '../assets/cross.svg'

const RequirementItem = ({ isValid, text }: { isValid: boolean, text: string }) => (
    <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src={isValid ? tick : cross} alt="" style={{ width: '25px' }} />
        {text}
    </p>
);

export default RequirementItem;