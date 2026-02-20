import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, roc_curve
from scipy.stats import ks_2samp
import math

# =============================================================================
# 1. SYNTHETIC DATA GENERATION (Institutional Sample)
# =============================================================================
def generate_synthetic_data(n=10000):
    np.random.seed(42)
    
    # Financial & Digital Footprint Features
    avg_monthly_income = np.random.lognormal(mean=10, sigma=0.5, size=n)
    income_volatility = np.random.uniform(0.05, 0.4, size=n)
    debt_ratio = np.random.beta(a=2, b=5, size=n)
    utility_payment_streak = np.random.poisson(lam=8, size=n)
    
    # Behavioral & Psychometric Signals
    impulse_control = np.random.normal(loc=0.6, scale=0.15, size=n).clip(0, 1)
    integrity_score = np.random.normal(loc=0.7, scale=0.12, size=n).clip(0, 1)
    
    # Protected Attribute / Testing Bias
    residence_type = np.random.choice(['Urban', 'Rural'], size=n, p=[0.65, 0.35])
    
    # Target Construction (Probability of Default - PoD)
    linear_comb = (
        -0.8 * np.log(avg_monthly_income/10000) +
        1.5 * income_volatility +
        2.5 * debt_ratio -
        0.5 * utility_payment_streak / 5 -
        2.0 * impulse_control -
        1.8 * integrity_score
    )
    
    prob_default = 1 / (1 + np.exp(-linear_comb))
    default_event = (prob_default > np.random.uniform(0, 1, size=n)).astype(int)
    
    df = pd.DataFrame({
        'avg_monthly_income': avg_monthly_income,
        'income_volatility': income_volatility,
        'debt_ratio': debt_ratio,
        'utility_payment_streak': utility_payment_streak,
        'impulse_control': impulse_control,
        'integrity_score': integrity_score,
        'residence_type': residence_type,
        'target': default_event
    })
    return df

# =============================================================================
# 2. WOE BINNING & INFORMATION VALUE (IV)
# =============================================================================
def calculate_woe_iv(df, feature, target):
    df[feature] = pd.qcut(df[feature], q=5, duplicates='drop').astype(str)
    
    stats = df.groupby(feature)[target].agg(['count', 'sum'])
    stats.columns = ['Count', 'Events']
    stats['Non-Events'] = stats['Count'] - stats['Events']
    
    event_rate = stats['Events'] / stats['Events'].sum()
    non_event_rate = stats['Non-Events'] / stats['Non-Events'].sum()
    
    event_rate = event_rate.replace(0, 0.0001)
    non_event_rate = non_event_rate.replace(0, 0.0001)
    
    stats['WoE'] = np.log(non_event_rate / event_rate)
    stats['IV'] = (non_event_rate - event_rate) * stats['WoE']
    
    return stats[['WoE', 'IV']]

# =============================================================================
# 3. MAIN PIPELINE
# =============================================================================
if __name__ == "__main__":
    df_source = generate_synthetic_data()
    target_col = 'target'
    features = [col for col in df_source.columns if col not in [target_col, 'residence_type']]

    woe_dicts = {}
    iv_report = {}

    for f in features:
        temp_stats = calculate_woe_iv(df_source.copy(), f, target_col)
        iv = temp_stats['IV'].sum()
        if iv >= 0.02:
            iv_report[f] = iv
            woe_dicts[f] = temp_stats['WoE'].to_dict()

    df_woe = pd.DataFrame()
    for f in woe_dicts.keys():
        bins = pd.qcut(df_source[f], q=5, duplicates='drop').astype(str)
        df_woe[f] = bins.map(woe_dicts[f])

    df_woe[target_col] = df_source[target_col]
    X = df_woe.drop(target_col, axis=1)
    y = df_woe[target_col]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = LogisticRegression()
    model.fit(X_train, y_train)

    probs = model.predict_proba(X_test)[:, 1]
    auc = roc_auc_score(y_test, probs)
    print(f"Antigravity Pipeline Initialized. Model AUC: {auc:.4f}")

    # Scaling
    pdo = 40
    target_score = 600
    target_odds = 50
    factor = pdo / math.log(2)
    offset = target_score - factor * math.log(target_odds)

    log_odds = model.decision_function(X)
    df_source['Score'] = (offset - factor * log_odds).round().astype(int).clip(300, 900)
    print(f"Scorecard Scaling complete. Sample score: {df_source['Score'].iloc[0]}")
