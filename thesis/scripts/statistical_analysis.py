# scripts/statistical_analysis.py
"""
Complete Statistical Analysis for Bachelor Thesis
Analyzes manual vs automated testing metrics with statistical validation

"""

import pandas as pd
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import json

# Paths
SCRIPT_DIR = Path(__file__).resolve().parent
THESIS_ROOT = SCRIPT_DIR.parent

# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 8)

# ============================================================
# DATA LOADING
# ============================================================

def load_manual_baseline():
    """Load manual testing baseline data"""
    
    file = THESIS_ROOT / "data" / "manual_baseline.csv"
    
    return pd.read_csv(file)

def load_automated_metrics():
    """Load automated testing metrics from CI/CD"""
    file = THESIS_ROOT / "metrics" / "ci_metrics_all.csv"
    
    return pd.read_csv(file)

def load_coverage_data():
    """Load coverage metrics"""
    file = THESIS_ROOT / "metrics" / "coverage_history.csv"
    
    return pd.read_csv(file)

# ============================================================
# STATISTICAL TESTS
# ============================================================

def test_rq1_coverage(manual_estimate=45):
    """
    RQ1: Code Coverage Comparison
    H0: Automated coverage = 45% (manual estimate)
    H1: Automated coverage > 45%
    Test: One-sample t-test
    """
    print("\n" + "=" * 70)
    print("RQ1: CODE COVERAGE ANALYSIS")
    print("=" * 70)
    
    coverage_df = load_coverage_data()

    # Composite coverage per CI run = mean of 3 components (n=25 independent observations)
    # Using per-run composite avoids pseudo-replication from treating 3 components as independent
    composite_coverage = coverage_df[['backend_line', 'frontend_line', 'frontend_admin_line']].mean(axis=1)

    # Latest values for individual reporting
    latest = coverage_df.iloc[-1]
    # Latest composite = snapshot of current state (used for bar chart, not for test)
    latest_composite = float(coverage_df[['backend_line', 'frontend_line', 'frontend_admin_line']].iloc[-1].mean())

    # One-sample t-test: Is automated coverage > manual estimate?
    t_statistic, p_value = stats.ttest_1samp(composite_coverage, manual_estimate, alternative='greater')

    # Effect size (Cohen's d)
    cohens_d = (composite_coverage.mean() - manual_estimate) / composite_coverage.std(ddof=1)

    # Results
    results = {
        "test": "One-sample t-test (composite per CI run)",
        "h0": f"Automated coverage = {manual_estimate}%",
        "h1": f"Automated coverage > {manual_estimate}%",
        "manual_estimate": manual_estimate,
        "backend_coverage": latest['backend_line'],
        "frontend_coverage": latest['frontend_line'],
        "frontend_admin_coverage": latest['frontend_admin_line'],
        "automated_latest_composite": latest_composite,
        "automated_mean": composite_coverage.mean(),
        "automated_std": composite_coverage.std(ddof=1),
        "n": len(composite_coverage),
        "t_statistic": t_statistic,
        "p_value": p_value,
        "cohens_d": cohens_d,
        "significant": p_value < 0.05,
        "effect_size_interpretation": interpret_cohens_d(cohens_d)
    }

    # Print results
    print(f"\nManual Coverage (estimate): {manual_estimate}%")
    print(f"Automated Coverage (measured): {composite_coverage.mean():.2f}% (SD={composite_coverage.std(ddof=1):.2f})")
    print(f"Improvement: +{composite_coverage.mean() - manual_estimate:.2f} percentage points")
    print(f"\nStatistical Test: One-sample t-test (n={len(composite_coverage)} CI runs, composite coverage)")
    print(f"  t({len(composite_coverage)-1}) = {t_statistic:.3f}")
    print(f"  p = {p_value:.6f} {'***' if p_value < 0.001 else '**' if p_value < 0.01 else '*' if p_value < 0.05 else 'ns'}")
    print(f"  Cohen's d = {cohens_d:.3f} ({interpret_cohens_d(cohens_d)})")
    
    if p_value < 0.05:
        print(f"\n RESULT: Automated testing SIGNIFICANTLY increases coverage (p < 0.05)")
    else:
        print(f"\n RESULT: No significant difference found (p >= 0.05)")
    
    return results

def test_rq2_execution_time():
    """
    RQ2: Execution Time Comparison
    Compares FULL manual test cycle vs automated pipeline duration.
    H0: Automated pipeline time >= Manual cycle time
    H1: Automated pipeline time < Manual cycle time
    Test: Welch's independent t-test (unequal variances)
    """
    print("\n" + "=" * 70)
    print("RQ2: EXECUTION TIME ANALYSIS")
    print("=" * 70)

    # Load data
    manual_df = load_manual_baseline()
    auto_df = load_automated_metrics()

    # Manual: each row is one complete test cycle
    manual_cycle_times = manual_df['cycle_time_min']

    # Testing-only time = cycle minus deployment (used for MTTD)
    testing_cycle_times = manual_df['cycle_time_min'] - manual_df['deployment_time_min']
    testing_cycle_mean = testing_cycle_times.mean()
    manual_cycle_mean = manual_cycle_times.mean()
    manual_cycle_std = manual_cycle_times.std(ddof=1)
    n_manual = len(manual_cycle_times)

    # Automated: each pipeline run covers all tests at once
    auto_times = auto_df.loc[auto_df['conclusion'] == 'success', 'duration_minutes']
    auto_failed_times = auto_df.loc[auto_df['conclusion'] == 'failure', 'duration_minutes']
    auto_std = auto_times.std(ddof=1)
    n_auto = len(auto_times)

    # Welch's independent t-test (unequal variances, one-sided: automated < manual)
    t_statistic, p_value = stats.ttest_ind(
        auto_times, manual_cycle_times,
        equal_var=False,
        alternative='less'
    )

    # Welch-Satterthwaite degrees of freedom
    s1, s2 = auto_times.var(ddof=1), manual_cycle_times.var(ddof=1)
    df_welch = (s1/n_auto + s2/n_manual)**2 / (
        (s1/n_auto)**2 / (n_auto - 1) + (s2/n_manual)**2 / (n_manual - 1)
    )

    # Effect size: Cohen's d using pooled SD (Hedges' approach for unequal n)
    pooled_std = np.sqrt(((n_auto - 1) * s1 + (n_manual - 1) * s2) / (n_auto + n_manual - 2))
    cohens_d = (manual_cycle_mean - auto_times.mean()) / pooled_std

    # Speed improvement
    speedup = manual_cycle_mean / auto_times.mean()

    results = {
        "test": "Welch's independent t-test",
        "h0": "Automated pipeline time >= Manual cycle time",
        "h1": "Automated pipeline time < Manual cycle time",
        "manual_cycle_mean": manual_cycle_mean,
        "manual_cycle_std": manual_cycle_std,
        "manual_cycle_runs": n_manual,
        "manual_num_test_cases": len(manual_df),
        "automated_mean": auto_times.mean(),
        "automated_failed_mean": auto_failed_times.mean(),
        "automated_std": float(auto_std),
        "automated_n": n_auto,
        "df_welch": df_welch,
        "t_statistic": t_statistic,
        "p_value": p_value,
        "cohens_d": cohens_d,
        "speedup": speedup,
        "time_saved_per_cycle": manual_cycle_mean - auto_times.mean(),
        "significant": p_value < 0.05,
        "effect_size_interpretation": interpret_cohens_d(cohens_d)
    }

    # Print results
    print(f"\nManual Testing (full cycle, n={n_manual} runs):")
    print(f"  Cycle time: {manual_cycle_mean:.2f} minutes (SD={manual_cycle_std:.2f}, n={n_manual})")
    print(f"\nAutomated Pipeline (all tests in one run):")
    print(f"  Mean: {auto_times.mean():.4f} minutes (SD={auto_std:.4f}, n={n_auto})")
    print(f"\nImprovement:")
    print(f"  Time saved: {manual_cycle_mean - auto_times.mean():.2f} minutes per cycle")
    print(f"  Speedup: {speedup:.1f}× faster")
    print(f"\nStatistical Test: Welch's independent t-test")
    print(f"  t({df_welch:.2f}) = {t_statistic:.3f}")
    print(f"  p = {p_value:.6e} {'***' if p_value < 0.001 else '**' if p_value < 0.01 else '*' if p_value < 0.05 else 'ns'}")
    print(f"  Cohen's d = {cohens_d:.3f} ({interpret_cohens_d(cohens_d)})")

    if p_value < 0.05:
        print(f"\n RESULT: Automated pipeline is SIGNIFICANTLY faster than manual cycle (p < 0.05)")
    else:
        print(f"\n RESULT: No significant time difference (p >= 0.05)")

    return results

def test_rq2_bug_detection():
    """
    RQ2: Regression Detection Analysis
    Compares bug detection capabilities:
    - Manual: bugs found per test cycle (limited by frequency)
    - Automated: regressions caught per week (CI failures on master)
    Descriptive comparison (not a statistical test — different units)
    """
    print("\n" + "=" * 70)
    print("RQ2: REGRESSION DETECTION ANALYSIS")
    print("=" * 70)

    # Load data
    manual_df = load_manual_baseline()
    auto_df = load_automated_metrics()

    # Manual: bugs found per cycle (same test suite each run)
    manual_bugs_per_cycle = int(manual_df['bugs_found'].iloc[0])
    manual_test_cases = 19  # test cases excluding deployment

    # Automated: CI failures on master = regressions caught
    auto_df['date'] = pd.to_datetime(auto_df['date'])
    master_runs = auto_df[auto_df['branch'] == 'master'] if 'branch' in auto_df.columns else auto_df
    total_runs = len(master_runs)
    failures = len(master_runs[master_runs['conclusion'] == 'failure'])
    successes = total_runs - failures

    # Time span
    time_span_days = (auto_df['date'].max() - auto_df['date'].min()).days + 1  # inclusive
    time_span_weeks = max(time_span_days / 7, 1)

    # Frequency advantage
    manual_cycles_per_week = 1  # Assumption: manual testing once per week
    auto_runs_per_week = total_runs / time_span_weeks

    # Total detection capacity
    manual_bugs_per_week = manual_bugs_per_cycle * manual_cycles_per_week
    auto_catches_per_week = failures / time_span_weeks if time_span_weeks > 0 else 0

    success_rate = successes / total_runs * 100 if total_runs > 0 else 0

    # --- MTTD Statistical Analysis ---
    # Manual MTTD = half of testing-only cycle time (uniform probability assumption)
    # Deployment excluded: bugs are detected during testing, not deployment
    testing_cycle_mean = (manual_df['cycle_time_min'] - manual_df['deployment_time_min']).mean()
    manual_mttd = testing_cycle_mean / 2
    # Automated MTTD = failed run duration (time to detect regression)
    failed_runs = master_runs[master_runs['conclusion'] == 'failure']['duration_minutes']
    mttd_n = len(failed_runs)
    mttd_mean = failed_runs.mean()
    mttd_std = failed_runs.std(ddof=1)

    # One-sample t-test: is automated MTTD < manual MTTD?
    # Manual MTTD is a derived constant (cycle_mean/2 under uniform probability assumption),
    # not a sample — one-sample t-test is appropriate here.
    mttd_t, mttd_p = stats.ttest_1samp(failed_runs, manual_mttd, alternative='less')
    mttd_d = abs(mttd_mean - manual_mttd) / mttd_std

    results = {
        "test": "Descriptive comparison",
        "manual_bugs_per_cycle": manual_bugs_per_cycle,
        "manual_test_cases": manual_test_cases,
        "manual_cycles_per_week": manual_cycles_per_week,
        "manual_bugs_per_week": manual_bugs_per_week,
        "automated_runs_per_week": auto_runs_per_week,
        "automated_catches_per_week": auto_catches_per_week,
        "frequency_advantage": auto_runs_per_week / manual_cycles_per_week,
        "significant": True,
        # MTTD statistics
        "mttd_manual": manual_mttd,
        "mttd_automated_mean": mttd_mean,
        "mttd_automated_std": mttd_std,
        "mttd_n": mttd_n,
        "mttd_t_statistic": mttd_t,
        "mttd_p_value": mttd_p,
        "mttd_cohens_d": mttd_d,
        "mttd_speedup": manual_mttd / mttd_mean,
        "mttd_reduction_pct": (1 - mttd_mean / manual_mttd) * 100,
    }

    # Print results
    print(f"\nManual Testing:")
    print(f"  Test cases: {manual_test_cases}")
    print(f"  Bugs found per cycle: {manual_bugs_per_cycle}")
    print(f"  Frequency: ~{manual_cycles_per_week} cycle/week")
    print(f"  Bugs caught per week: ~{manual_bugs_per_week}")
    print(f"\nAutomated Testing (CI/CD):")
    print(f"  Total pipeline runs: {total_runs}")
    print(f"  Failures caught: {failures}")
    print(f"  Success rate: {success_rate:.1f}%")
    print(f"  Frequency: {auto_runs_per_week:.1f} runs/week")
    print(f"\nKey Advantage:")
    print(f"  Frequency: {auto_runs_per_week / manual_cycles_per_week:.1f}× more test cycles")
    print(f"  Every commit is tested — regressions caught within minutes")

    print(f"\nMTTD Statistical Analysis:")
    print(f"  Manual In-session MTTD: {manual_mttd:.1f} min")
    print(f"  Automated MTTD (failed runs): {mttd_mean:.2f} min (SD={mttd_std})")
    print(f"  n = {mttd_n}")
    print(f"  t({mttd_n-1}) = {mttd_t:.2f}")
    print(f"  p = {mttd_p:.6f} {'***' if mttd_p < 0.001 else '**' if mttd_p < 0.01 else '*' if mttd_p < 0.05 else 'ns'}")
    print(f"  Cohen's d = {mttd_d:.1f}")
    print(f"  Speedup: {manual_mttd / mttd_mean:.1f}×")
    print(f"  Reduction: {(1 - mttd_mean / manual_mttd) * 100:.1f}%")

    print(f"\n RESULT: Automated CI runs {auto_runs_per_week:.1f}× per week vs {manual_cycles_per_week} manual cycle")

    return results

def test_rq3_deployment_frequency():
    """
    RQ3: Deployment Frequency
    Simple ratio comparison (no statistical test needed for frequency count)
    """
    print("\n" + "=" * 70)
    print("RQ3: DEPLOYMENT FREQUENCY ANALYSIS")
    print("=" * 70)
    
    # Load deployment data from CI metrics
    auto_df = load_automated_metrics()
    
    # Pipeline run stats
    total_runs = len(auto_df)
    successful_runs = auto_df[auto_df['conclusion'] == 'success']
    failures = total_runs - len(successful_runs)
    success_rate = len(successful_runs) / total_runs * 100 if total_runs > 0 else 0

    # Calculate time span
    auto_df['date'] = pd.to_datetime(auto_df['date'])
    time_span_days = (auto_df['date'].max() - auto_df['date'].min()).days + 1  # inclusive
    time_span_weeks = max(time_span_days / 7, 1)

    # Deployment frequency
    auto_deploys_per_week = len(successful_runs) / time_span_weeks
    manual_deploys_per_week = 1  # Assumption: 1 deploy per week manually

    improvement = (auto_deploys_per_week - manual_deploys_per_week) / manual_deploys_per_week * 100

    results = {
        "manual_deploys_per_week": manual_deploys_per_week,
        "automated_deploys_per_week": auto_deploys_per_week,
        "total_automated_deploys": len(successful_runs) + 1,
        "automated_total_runs": total_runs,
        "automated_successes": len(successful_runs),
        "automated_failures": failures,
        "automated_success_rate": success_rate,
        "time_span_weeks": time_span_weeks,
        "improvement_percent": improvement
    }

    # Print results
    print(f"\nManual Deployment:")
    print(f"  Frequency: ~{manual_deploys_per_week} deployment/week")
    print(f"\nAutomated Deployment (CI/CD):")
    print(f"  Total pipeline runs: {total_runs}")
    print(f"  Successful deployments: {len(successful_runs)}")
    print(f"  Failures: {failures}")
    print(f"  Success rate: {success_rate:.1f}%")
    print(f"  Frequency: {auto_deploys_per_week:.1f} deployments/week")
    print(f"\nImprovement:")
    print(f"  Increase: {improvement:.0f}%")
    print(f"  Factor: {auto_deploys_per_week / manual_deploys_per_week:.1f}× more frequent")

    print(f"\n RESULT: Deployment frequency increased {auto_deploys_per_week / manual_deploys_per_week:.1f}× with automation")
    
    return results

def test_rq4_roi():
    """
    RQ4: Return on Investment — Hybrid Scenario Analysis
    Two frequency scenarios:
      - Scenario A (Conservative):    only successful runs (n=20, F=14/week)
      - Scenario B (Equivalent Value): all pipeline runs   (n=42, F=29.4/week)
    Break-even in number of runs is identical across both scenarios.
    """
    print("\n" + "=" * 70)
    print("RQ4: RETURN ON INVESTMENT (ROI) ANALYSIS — HYBRID SCENARIOS")
    print("=" * 70)

    # Load time data
    manual_df = load_manual_baseline()
    auto_df = load_automated_metrics()

    # Constants
    implementation_hours = 145  # CI/CD setup time
    hourly_rate = 27             # Mean developer gross salary EUR/hour
    quarters_weeks = 12          # Analysis period

    # Per-cycle time savings (delta_t) — identical for both scenarios
    manual_time_per_cycle = manual_df['cycle_time_min'].mean()
    successful_runs = auto_df[auto_df['conclusion'] == 'success']
    auto_time_per_cycle = successful_runs['duration_minutes'].mean()

    delta_t_min   = manual_time_per_cycle - auto_time_per_cycle
    delta_t_hours = delta_t_min / 60

    implementation_eur = implementation_hours * hourly_rate

    # Break-even in runs is frequency-independent
    break_even_runs = implementation_hours / delta_t_hours

    # Time span
    dates      = pd.to_datetime(auto_df['date'])
    total_days = (dates.max() - dates.min()).days + 1  # inclusive
    weeks_span = total_days / 7

    def _calc_scenario(freq):
        weekly_savings   = delta_t_hours * freq
        total_savings    = weekly_savings * quarters_weeks
        total_savings_eur = total_savings * hourly_rate
        net_benefit      = total_savings - implementation_hours
        net_benefit_eur  = total_savings_eur - implementation_eur
        roi              = (net_benefit / implementation_hours) * 100
        bep_weeks        = break_even_runs / freq
        return {
            "frequency":             freq,
            "weekly_savings_hours":  weekly_savings,
            "total_saved_12_weeks":  total_savings,
            "total_saved_12_weeks_eur": total_savings_eur,
            "net_benefit_12_weeks":  net_benefit,
            "net_benefit_12_weeks_eur": net_benefit_eur,
            "roi_12_weeks":          roi,
            "break_even_weeks":      bep_weeks,
        }

    # Scenario A — Conservative (successful runs only)
    freq_conservative = len(successful_runs) / weeks_span
    scenario_a = _calc_scenario(freq_conservative)

    # Scenario B — Equivalent Value (all runs)
    freq_equiv = len(auto_df) / weeks_span
    scenario_b = _calc_scenario(freq_equiv)

    results = {
        "implementation_hours":    implementation_hours,
        "implementation_eur":      implementation_eur,
        "hourly_rate":             hourly_rate,
        "manual_hours_per_cycle":  manual_time_per_cycle / 60,
        "automated_hours_per_cycle": auto_time_per_cycle / 60,
        "delta_t_min":             delta_t_min,
        "delta_t_hours":           delta_t_hours,
        "break_even_runs":         break_even_runs,
        "time_saved_per_cycle":    delta_t_hours,
        # Primary (Equivalent Value) — kept for backwards-compat with charts
        "frequency":               freq_equiv,
        "weekly_savings_hours":    scenario_b["weekly_savings_hours"],
        "total_saved_12_weeks":    scenario_b["total_saved_12_weeks"],
        "total_saved_12_weeks_eur": scenario_b["total_saved_12_weeks_eur"],
        "net_benefit_12_weeks":    scenario_b["net_benefit_12_weeks"],
        "net_benefit_12_weeks_eur": scenario_b["net_benefit_12_weeks_eur"],
        "roi_12_weeks":            scenario_b["roi_12_weeks"],
        "break_even_weeks":        scenario_b["break_even_weeks"],
        "runs_per_week":           freq_equiv,
        # Scenario A (Conservative)
        "scenario_a": scenario_a,
        # Scenario B (Equivalent Value)
        "scenario_b": scenario_b,
    }

    # Print results
    print(f"\nPer-Cycle Savings (delta_t) — shared by both scenarios:")
    print(f"  Manual execution:     {manual_time_per_cycle:.2f} min ({manual_time_per_cycle/60:.4f} h)")
    print(f"  Automated execution:  {auto_time_per_cycle:.2f} min ({auto_time_per_cycle/60:.4f} h)")
    print(f"  Time saved per cycle: {delta_t_min:.2f} min ({delta_t_hours:.4f} h)")
    print(f"  Break-even (runs):    {break_even_runs:.2f} runs  (identical for both scenarios)")

    for label, sc in [("A — Conservative (successful only)", scenario_a),
                      ("B — Equivalent Value (all runs)",    scenario_b)]:
        print(f"\n{'='*60}")
        print(f"  Scenario {label}")
        print(f"{'='*60}")
        print(f"  Frequency:          {sc['frequency']:.1f} runs/week")
        print(f"  Weekly savings:     {sc['weekly_savings_hours']:.2f} h")
        print(f"  Total savings (12w):{sc['total_saved_12_weeks']:.2f} h  /  {sc['total_saved_12_weeks_eur']:,.0f} EUR")
        print(f"  Net benefit:        {sc['net_benefit_12_weeks']:.2f} h  /  {sc['net_benefit_12_weeks_eur']:,.0f} EUR")
        print(f"  ROI:                {sc['roi_12_weeks']:.2f}%")
        print(f"  Break-even (weeks): {sc['break_even_weeks']:.2f} weeks")

    print(f"\n RESULT: ROI ranges from {scenario_a['roi_12_weeks']:.0f}% (conservative) "
          f"to {scenario_b['roi_12_weeks']:.0f}% (equivalent value); "
          f"BEP at {break_even_runs:.0f} runs in both scenarios")

    return results

# ============================================================
# UTILITY FUNCTIONS
# ============================================================

def interpret_cohens_d(d):
    """Interpret Cohen's d effect size"""
    abs_d = abs(d)
    if abs_d < 0.2:
        return "negligible"
    elif abs_d < 0.5:
        return "small"
    elif abs_d < 0.8:
        return "medium"
    elif abs_d < 1.2:
        return "large"
    else:
        return "very large"


# ============================================================
# MAIN EXECUTION
# ============================================================

def main():
    """Run complete statistical analysis"""
    
    print("\n" + "=" * 70)
    print("STATISTICAL ANALYSIS")
    print("Automated Testing Impact on Software Quality")
    print("=" * 70)
    
    # Create output directory
    output_dir = SCRIPT_DIR.parent / "results"
    output_dir.mkdir(exist_ok=True)
    
    # Run all statistical tests
    all_results = {}
    
    all_results['rq1'] = test_rq1_coverage()
    all_results['rq2_time'] = test_rq2_execution_time()
    all_results['rq2_bugs'] = test_rq2_bug_detection()
    all_results['rq3'] = test_rq3_deployment_frequency()
    all_results['rq4'] = test_rq4_roi()
    
    # Save results to JSON
    results_file = output_dir / "statistical_results.json"
    
    # Convert numpy types to Python types
    class NumpyEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, np.integer):
                return int(obj)
            if isinstance(obj, np.floating):
                return float(obj)
            if isinstance(obj, np.bool_):
                return bool(obj)
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            return super().default(obj)

    with open(results_file, 'w') as f:
        json.dump(all_results, f, indent=2, cls=NumpyEncoder)
    
    print(f"\n Results saved to {results_file}")
    
    # Print summary
    print("\n" + "=" * 70)
    print("SUMMARY OF FINDINGS")
    print("=" * 70)
    
    print("\n RQ1 - Code Coverage:")
    if all_results['rq1']['significant']:
        print(f"   Automated coverage ({all_results['rq1']['automated_mean']:.1f}%) is SIGNIFICANTLY higher than manual estimate ({all_results['rq1']['manual_estimate']}%)")
        print(f"   p = {all_results['rq1']['p_value']:.6f}, Cohen's d = {all_results['rq1']['cohens_d']:.2f}")
    
    print("\n RQ2 - Execution Time:")
    if all_results['rq2_time']['significant']:
        print(f"   Automated pipeline ({all_results['rq2_time']['automated_mean']:.2f}min) is SIGNIFICANTLY faster than manual cycle ({all_results['rq2_time']['manual_cycle_mean']:.2f}min)")
        print(f"   Speedup: {all_results['rq2_time']['speedup']:.1f}× faster")
        print(f"   p = {all_results['rq2_time']['p_value']:.6f}, Cohen's d = {all_results['rq2_time']['cohens_d']:.2f}")

    print("\n RQ2.1 - Bug Detection:")
    rq2_bugs = all_results['rq2_bugs']
    print(f"   Automated CI runs {rq2_bugs['frequency_advantage']:.1f}× more often than manual testing")
    print(f"   {rq2_bugs['automated_runs_per_week']:.1f} automated runs/week vs {rq2_bugs['manual_cycles_per_week']} manual cycle/week")
    rq3 = all_results['rq3']
    print(f"   {rq3['automated_failures']} regressions caught in {rq3['automated_total_runs']} runs ({rq3['automated_success_rate']:.1f}% success rate)")

    print("\n RQ3 - Deployment Frequency:")
    print(f"   Deployments increased from {rq3['manual_deploys_per_week']}/week to {rq3['automated_deploys_per_week']:.1f}/week")
    print(f"   Improvement: {rq3['improvement_percent']:.0f}%")
    
    print("\n RQ4 - Return on Investment (Equivalent Value):")
    print(f"   Break-even: {all_results['rq4']['break_even_runs']:.0f} runs ({all_results['rq4']['break_even_weeks']:.2f} weeks)")
    print(f"   12-week ROI: {all_results['rq4']['roi_12_weeks']:.0f}%")
    print(f"   Net benefit: {all_results['rq4']['net_benefit_12_weeks']:.1f}h / {all_results['rq4']['net_benefit_12_weeks_eur']:,.0f} EUR")
    
    print("\n" + "=" * 70)
    print(" STATISTICAL ANALYSIS COMPLETE!")
    print("=" * 70)
    print(f"\n Output files:")
    print(f"   - {results_file}")
    print(f"   - {output_dir}/statistical_analysis.png")

if __name__ == "__main__":
    main()