import Card from '@mui/material/Card';
import { Translation } from '../types/translation';

interface TranslationDetailsContentProps {
    translation: Translation;
}

const TranslationDetailsContent = ({translation}: TranslationDetailsContentProps) => {

    const { name, initial_text, translated_text, formatted_timestamp } = translation;

    return (
        <>
            <section className='translation-details-info'>
                            <h3>{name}</h3>
                            <p>{formatted_timestamp}</p>
                        </section>

                        <section className='translation-details-container'>

                            <div className='translation-details-section'>

                                <h3>Eingangstext</h3>

                                <Card className='translator__results-container'>
                                    {initial_text}
                                </Card>

                            </div>

                            <div className='translation-details-section'>

                                <h3>Ergebnis</h3>

                                <Card className='translator__results-container'>
                                    {translated_text}
                                </Card>

                            </div>

                        </section>
        </>
    );
}

export default TranslationDetailsContent;
