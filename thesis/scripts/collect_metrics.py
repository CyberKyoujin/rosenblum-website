"""
Thesis Metrics Collection Script
Collects CI/CD metrics from GitHub Actions for thesis analysis
"""
import requests
import pandas as pd
import json
from datetime import datetime
from pathlib import Path
import os
from decouple import config

# Configuration
GITHUB_TOKEN = config("GITHUB_TOKEN") 
REPO = "CyberKyoujin/rosenblum-website"
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}

def collect_workflow_runs():
    """Collect all CI/CD workflow runs"""
    
    url = f"https://api.github.com/repos/{REPO}/actions/runs"
    
    all_runs = []
    page = 1
    
    while True:
        response = requests.get(
            url,
            headers=HEADERS,
            params={"per_page": 100, "page": page}
        )
        
        if response.status_code != 200:
            print(f"Error: {response.status_code}")
            if not GITHUB_TOKEN:
                print("⚠️  No GITHUB_TOKEN set. You may hit rate limits.")
                print("   Set token: export GITHUB_TOKEN='your_token'")
            break
        
        data = response.json()
        runs = data.get("workflow_runs", [])
        
        if not runs:
            break
            
        all_runs.extend(runs)
        print(f"Collected page {page}: {len(runs)} runs")
        
        page += 1
        if page > 10:  # Safety limit
            break
    
    return all_runs

def parse_run_data(runs):
    """Parse workflow run data into metrics"""
    
    metrics = []
    
    for run in runs:
        # Parse timestamps
        created = pd.to_datetime(run["created_at"])
        updated = pd.to_datetime(run["updated_at"])
        duration = (updated - created).total_seconds()
        
        # Extract job information from run
        conclusion = run.get("conclusion", "unknown")
        status = run.get("status", "unknown")
        
        metric = {
            "date": created.strftime("%Y-%m-%d %H:%M:%S"),
            "workflow": run["name"],
            "status": status,
            "conclusion": conclusion,
            "duration_seconds": duration,
            "duration_minutes": round(duration / 60, 2),
            "commit": run["head_sha"][:7],
            "branch": run["head_branch"],
            "run_number": run["run_number"],
            "run_id": run["id"]
        }
        
        metrics.append(metric)
    
    return pd.DataFrame(metrics)

def get_job_details(run_id):
    """Get detailed job information for a specific run"""
    
    url = f"https://api.github.com/repos/{REPO}/actions/runs/{run_id}/jobs"
    
    response = requests.get(url, headers=HEADERS)
    
    if response.status_code != 200:
        return []
    
    jobs = response.json().get("jobs", [])
    
    job_data = []
    for job in jobs:
        started = pd.to_datetime(job["started_at"]) if job.get("started_at") else None
        completed = pd.to_datetime(job["completed_at"]) if job.get("completed_at") else None
        
        duration = (completed - started).total_seconds() if started and completed else 0
        
        job_data.append({
            "job_name": job["name"],
            "conclusion": job.get("conclusion", "unknown"),
            "duration_seconds": duration
        })
    
    return job_data

def collect_detailed_metrics(df, sample_size=20):
    """Collect detailed job metrics for recent runs"""
    
    print(f"\nCollecting detailed job metrics (sample: {sample_size} runs)...")
    
    # Get recent successful runs
    recent_runs = df[df["conclusion"] == "success"].head(sample_size)
    
    all_job_data = []
    
    for idx, run in recent_runs.iterrows():
        print(f"  Fetching jobs for run #{run['run_number']}...")
        jobs = get_job_details(run["run_id"])
        
        for job in jobs:
            job["run_number"] = run["run_number"]
            job["date"] = run["date"]
            all_job_data.append(job)
    
    return pd.DataFrame(all_job_data) if all_job_data else None

def generate_summary(df, jobs_df=None):
    """Generate summary statistics"""
    
    summary = {
        "collection_date": datetime.now().isoformat(),
        "total_runs": len(df),
        "successful_runs": len(df[df["conclusion"] == "success"]),
        "failed_runs": len(df[df["conclusion"] == "failure"]),
        "success_rate": (df["conclusion"] == "success").mean() * 100,
        "avg_duration_minutes": df["duration_minutes"].mean(),
        "median_duration_minutes": df["duration_minutes"].median(),
        "min_duration_minutes": df["duration_minutes"].min(),
        "max_duration_minutes": df["duration_minutes"].max(),
    }
    
    # Per-job statistics if available
    if jobs_df is not None and not jobs_df.empty:
        job_stats = {}
        for job_name in jobs_df["job_name"].unique():
            job_data = jobs_df[jobs_df["job_name"] == job_name]
            job_stats[job_name] = {
                "avg_duration_seconds": job_data["duration_seconds"].mean(),
                "runs": len(job_data)
            }
        summary["job_statistics"] = job_stats
    
    return summary

def main():
    """Main execution"""
    
    print("=" * 60)
    print("THESIS METRICS COLLECTION")
    print("=" * 60)
    
    # Create output directory
    output_dir = Path("metrics")
    output_dir.mkdir(exist_ok=True)
    
    # Collect workflow runs
    print("\n📊 Collecting workflow runs...")
    runs = collect_workflow_runs()
    
    if not runs:
        print("❌ No runs collected!")
        return
    
    print(f"✅ Collected {len(runs)} total runs")
    
    # Parse into DataFrame
    df = parse_run_data(runs)
    
    # Save all runs
    output_file = output_dir / "ci_metrics_all.csv"
    df.to_csv(output_file, index=False)
    print(f"✅ Saved to {output_file}")
    
    # Collect detailed job metrics (sample)
    jobs_df = collect_detailed_metrics(df, sample_size=20)
    
    if jobs_df is not None:
        jobs_file = output_dir / "job_metrics_detailed.csv"
        jobs_df.to_csv(jobs_file, index=False)
        print(f"✅ Saved job details to {jobs_file}")
    
    # Generate summary
    summary = generate_summary(df, jobs_df)
    
    summary_file = output_dir / "summary.json"
    with open(summary_file, "w") as f:
        json.dump(summary, f, indent=2)
    
    print(f"✅ Saved summary to {summary_file}")
    
    # Print summary
    print("\n" + "=" * 60)
    print("SUMMARY STATISTICS")
    print("=" * 60)
    print(f"Total Runs: {summary['total_runs']}")
    print(f"Success Rate: {summary['success_rate']:.1f}%")
    print(f"Avg Duration: {summary['avg_duration_minutes']:.2f} minutes")
    print(f"Median Duration: {summary['median_duration_minutes']:.2f} minutes")
    
    if "job_statistics" in summary:
        print("\nPer-Job Statistics:")
        for job_name, stats in summary["job_statistics"].items():
            print(f"  {job_name}: {stats['avg_duration_seconds']:.1f}s (n={stats['runs']})")
    
    print("\n✅ Metrics collection complete!")
    print(f"📁 Output directory: {output_dir.absolute()}")

if __name__ == "__main__":
    main()