import Breadcrumbs from "@mui/material/Breadcrumbs"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"

interface NavigationSectionProps {
    first_link: string;
    second_link?: string;
}

const NavigationSection = ({first_link, second_link}: NavigationSectionProps) => {

    return (
        <section role="presentation" className="profile-navigation">
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/">Home</Link>
                { second_link ? (
                    <>
                        <Link underline="hover" color="inherit" href="/">{first_link}</Link>
                        <Typography color="text.primary">{second_link}</Typography>
                    </>
                ) : (
                    <Typography color="text.primary">{first_link}</Typography>
                )}
            </Breadcrumbs>
        </section>
    )
    
}

export default NavigationSection;