import { useTranslation } from "react-i18next";
import { IoPersonCircleOutline } from "react-icons/io5";

interface TeamMember {
    nameKey: string;
    roleKey: string;
    image?: string;
}

const TeamSection = () => {
    const { t } = useTranslation();

    const teamMembers: TeamMember[] = [
        {
            nameKey: "team.oleg.name",
            roleKey: "team.oleg.role"
        },
        {
            nameKey: "team.elana.name",
            roleKey: "team.elana.role"
        },
        {
            nameKey: "team.denys.name",
            roleKey: "team.denys.role"
        }
    ];

    return (
        <section className="ts">
            <div className="ts__header">
                <h2 className="ts__title">
                    {t("team.sectionTitle")}{" "}
                    <span className="header-span">{t("team.sectionTitleHighlight")}</span>
                </h2>
            </div>

            <div className="ts__grid">
                {teamMembers.map((member, index) => (
                    <div key={index} className="ts__card">
                        <div className="ts__card-image">
                            {member.image ? (
                                <img src={member.image} alt={t(member.nameKey)} />
                            ) : (
                                <div className="ts__card-placeholder">
                                    <IoPersonCircleOutline />
                                </div>
                            )}
                        </div>
                        <div className="ts__card-content">
                            <h3 className="ts__card-name">{t(member.nameKey)}</h3>
                            <div className="ts__card-divider"></div>
                            <p className="ts__card-role">{t(member.roleKey)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TeamSection;
